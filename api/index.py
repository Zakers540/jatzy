from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import os
from supabase import create_client, Client
from datetime import date
from time import localtime
import asyncio
import random
import string
import base64
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto import Random
import re

try:
    from passlib.hash import bcrypt
    HAVE_BCRYPT = False
except Exception:
    HAVE_BCRYPT = False
    print("passlib not available: falling back to AES")

cryptKey = b"dvawdbabdkawje802v354u0ba+d23u82nmyvn30cn2039xm234vn7"

url: str = os.environ.get('DATABASE_URL')
key: str = os.environ.get('DATABASE_KEY')
if not url or not key:
    raise RuntimeError("DATABASE_URL and DATABASE_KEY must be set as environment variables")

supabase: Client = create_client(url, key)

app = Flask(__name__)
CORS(app)

def rndURL(length: int = 6) -> str:
    return ''.join(random.choices(string.digits, k=length))

def cleanUsername(name: str) -> str:
    if not isinstance(name, str):
        return ""
    name = re.sub(r'\s+', ' ', name).strip()
    name = re.sub(r'[^A-Za-z0-9 _\-]', '', name)
    return name

def encrypt(key: bytes, source: bytes, encode: bool = True) -> str:
    key_h = SHA256.new(key).digest()
    IV = Random.new().read(AES.block_size)
    encryptor = AES.new(key_h, AES.MODE_CBC, IV)
    padding = AES.block_size - (len(source) % AES.block_size)
    source_padded = source + bytes([padding]) * padding
    data = IV + encryptor.encrypt(source_padded)
    return base64.b64encode(data).decode('utf-8') if encode else data

def decrypt(key: bytes, source: str, decode: bool = True) -> bytes:
    raw = base64.b64decode(source) if decode else source
    key_h = SHA256.new(key).digest()
    IV = raw[:AES.block_size]
    decryptor = AES.new(key_h, AES.MODE_CBC, IV)
    data = decryptor.decrypt(raw[AES.block_size:])
    padding = data[-1]
    if data[-padding:] != bytes([padding]) * padding:
        raise ValueError("Invalid padding")
    return data[:-padding]

players = ["Torben", "test"]

@app.route("/api/opret", methods=["GET"])
def gameInstance():
    instanceId = rndURL()
    instanceStartTime = [localtime().tm_mday, localtime().tm_mon]
    try:
        rsp = supabase.table("server").insert({"instanceId": instanceId, "timeCreated": instanceStartTime}).execute()
        return redirect(f"/server/{instanceId}", code=302)
    except Exception as e:
        return jsonify({"error": "Failed to create instance", "detail": str(e)}), 500

@app.route("/api/tjek/<instanceId>", methods=["GET"])
def instance_exists(instanceId):
    try:
        rsp = supabase.table("server").select("*").eq("instanceId", str(instanceId)).execute()
        data = getattr(rsp, "data", []) or []
        exists = bool(data and len(data) > 0)
        return jsonify({"exists": exists})
    except Exception as e:
        app.logger.exception("Error checking instance")
        return jsonify({"exists": False, "error": str(e)}), 500

@app.route("/api/logud", methods=["POST", "GET"])
def logud():
    try:
        # support JSON POST or query param for convenience
        data = request.get_json(silent=True) or {}
        user = data.get("username") or request.args.get("username") or ""
        if not user:
            return jsonify({"error": "username required"}), 400
        supabase.table("users").update({"online": False}).eq("username", user).execute()
        return jsonify({"loggedOut": True})
    except Exception as e:
        app.logger.exception("error logout")
        return jsonify({"error": "failed to logout", "detail": str(e)}), 500

@app.route("/api/whoami", methods=["GET"]) 
def whoami():
    try:
        instanceId = request.args.get("instanceId") or ""
        username = request.args.get("username") or ""
        if not instanceId or not username:
            return jsonify({"error": "instanceId and username required"}), 400
        rsp = supabase.table("users").select("username,online,turn,score").eq("gameInstance", str(instanceId)).eq("username", username).limit(1).execute()
        rows = getattr(rsp, "data", []) or []
        if not rows:
            return jsonify({"exists": False})
        return jsonify({"exists": True, "user": rows[0]})
    except Exception as e:
        app.logger.exception("Error in whoami")
        return jsonify({"error": "failed to lookup user", "detail": str(e)}), 500
    
@app.route("/api/data/<instanceId>", methods=["GET"])
def get_data(instanceId):
    try:
        currentPlayers = []
        rsp = supabase.table("users").select("*").eq("gameInstance", str(instanceId)).order("score", desc=True).execute()
        rows = getattr(rsp, "data", []) or []

        if not rows:
            return jsonify({
            "bestPlayer": None,
            "worstPlayer": None,
            "players": [""]
        })

        bestPlayer = rows[0].get("username")
        worstPlayer = rows[len(rows) - 1].get("username")
        for i in range(len(rows) - 1):
            if rows[i].get("online") == True:
                currentPlayers.append(rows[i].get("username"))
        return jsonify({
            "bestPlayer": bestPlayer,
            "worstPlayer": worstPlayer,
            "players": currentPlayers
        })
    except Exception as e:
        app.logger.exception("Error getting data")
        return jsonify({"errorExists": True ,"error": "Failed to get instance data", "detail": str(e)}), 500

@app.route("/api/tur/<instanceId>")
def turn(instanceId):
    try:
        rsp = supabase.table("server").select("turn").eq("instanceId", str(instanceId)).execute()
        rows = getattr(rsp, "data", []) or []

        if not rows:
            return jsonify({"errorExists": True, "error": "No data found for this instanceId"}), 404

        tur = rows[0].get("turn")
        return jsonify({"turn": tur})
    except Exception as e:
        return jsonify({"errorExists": True ,"error": "tur Failed", "detail": str(e)}), 500


@app.route("/api/jatzySheet/<instanceId>/<playerName>", methods=["GET", "POST"])
def scoreSheet(instanceId, playerName):
    try:
        rsp = supabase.table("users").select("score, username, turn").eq("gameInstance", str(instanceId)).order("score", desc=True).execute()
        rows = getattr(rsp, "data", []) or []
        if not rows:
            return jsonify({"error": "no users for instance", "players": []}), 404

        bestPlayer = rows[0]
        worstPlayer = rows[-1]

        srv = supabase.table("server").select("turn").eq("instanceId", str(instanceId)).limit(1).execute()
        Srows = getattr(srv, "data", []) or []
        current_turn_val = Srows[0].get("Turn") if Srows else None

        current_index = 0
        if current_turn_val is not None:
            for idx, r in enumerate(rows):
                if r.get("turn") == current_turn_val:
                    current_index = idx
                    break
        currentPlayer = rows[current_index]

        i = 0
        user = None
        while i < len(rows):
            if rows[i].get("username") == playerName:
                user = rows[i]
                break
            i += 1

        if user is None:
            user = rows[0]

        def get_score_field(record, field):
            score_obj = record.get("score") or {}
            val = score_obj.get(field, 0)
            try:
                return int(val)
            except Exception:
                return 0

        players_list = [
            user.get("username"),
            currentPlayer.get("username"),
            bestPlayer.get("username"),
            worstPlayer.get("username"),
        ]

        fields = [
            "ettere","toere","treere","firere","femmere","seksere",
            "sum","bonus","1par","2par","treens","fireens",
            "lillestraight","storstraight","fuldthus","chance","yatzy","total"
        ]

        sheet = {}
        for f in fields:
            sheet[f] = {
                "0": get_score_field(user, f),
                "1": get_score_field(currentPlayer, f),
                "2": get_score_field(bestPlayer, f),
                "3": get_score_field(worstPlayer, f),
            }

        result = {"players": players_list, "yatzySheet": sheet}

        return jsonify(result)
    except Exception as e:
        app.logger.exception("yatzySheet Failed")
        return jsonify({"errorExists": True, "error": "yatzySheet Failed", "detail": str(e)}), 500

@app.route("/api/rul/terning<int:which>", methods=["POST"])
def roll_die(which):
    try:
        data = request.get_json() or {}
        instanceId = data.get("instanceId")
        user = data.get("user")

        if not instanceId or not user:
            return jsonify({"error": "Missing instanceId or user"}), 400

        rsp = supabase.table("server").select("dice").eq("instanceId", str(instanceId)).single().execute()
        dice = rsp.data.get("dice", [1, 1, 1, 1, 1])  # default 5 dice

        dice[which - 1] = random.randint(1, 6)
        supabase.table("server").update({"dice": dice}).eq("instanceId", str(instanceId)).execute()

        return jsonify({"dice": dice[which - 1]})
    
    except Exception as e:
        app.logger.exception("Roll die failed")
        return jsonify({"error": str(e)}), 500

@app.route("/api/tryk/<instanceId>/<name>", methods=["POST"])
def update(instanceId, name):
    try:
        data = request.get_json(silent=True) or {}
        rsp = supabase.table("users").select("score, username").eq("gameInstance", str(instanceId)).execute()
        srv = supabase.table("server").select("turn").eq("instanceId", str(instanceId)).execute()
        
        sRows = getattr(srv, "data", []) or []
        if not sRows:
            return jsonify({"errorExists": True, "error": "gameInstance not found"}), 404

        rows = getattr(rsp, "data", []) or []
        if not rows:
            return jsonify({"errorExists": True, "error": "User not found"}), 404

        field = data.get("category")
        i = 0
        score = rows[i].get("score") or {}
        while rows[i].get("username") != name:
            score = rows[i].get("score") or {}
            i += 1
        
        turn = sRows[0].get("turn")
        if turn < len(rows) - 1:
            updatedTurn = turn + 1
        else:
            updatedTurn = 0

        if field in score:
            score[field] = data.get("fieldScore")
        else:
            return jsonify({"errorExists": True, "error": f"Invalid field: {field}"}), 400
        
        supabase.table("users").update({"score": score}).eq("username", name).eq("gameInstance", str(instanceId)).execute()
        supabase.table("server").update({"turn": updatedTurn}).eq("instanceId", str(instanceId)).execute()

        return jsonify({"errorExists": False, "error": ""})
    except Exception as e:
        app.logger.exception("score update Failed")
        return jsonify({"errorExists": True, "error": "score update Failed", "detail": str(e)}), 500

@app.route("/api/tjek/tid", methods=["GET"])
def serverTime():
    try:
        rsp = supabase.table("server").select("id,timeCreated").execute()
        rows = getattr(rsp, "data", []) or []
        if not rows:
            return jsonify({"deleted": 0, "checked": 0})
        now = date.today()
        deletedCount = 0
        checked = 0
        for row in rows:
            checked += 1
            tc = row.get("timeCreated")
            if not tc or not isinstance(tc, (list, tuple)) or len(tc) < 2:
                continue
            try:
                instanceDay, instanceMonth = int(tc[0]), int(tc[1])
                year = now.year if instanceMonth <= now.month else now.year - 1
                instanceDate = date(year, instanceMonth, instanceDay)
                daysOld = (now - instanceDate).days
                if daysOld >= 7:
                    supabase.table("server").delete().eq("id", row.get("id")).execute()
                    supabase.table("users").delete().eq("gameInstance", row.get("id")).execute()
                    deletedCount += 1
            except Exception:
                app.logger.exception("Error processing row")
                continue
        return jsonify({"deleted": deletedCount, "checked": checked})
    except Exception as e:
        app.logger.exception("Error in serverTime")
        return jsonify({"error": "Failed to check server times", "deleted": 0, "checked": 0}), 500

@app.route("/api/tjek/<instanceId>/<playerName>", methods=["GET"])
def name_exists(playerName, instanceId):
    cleaned = cleanUsername(playerName)
    return jsonify({"login": True, "errorExists": False, "error": ""})

@app.route("/api/tilfoej", methods=["POST"])
def addUser():
    data = request.get_json(silent=True) or {}
    instanceId = data.get("instanceId")
    user = data.get("user", "")
    password = data.get("password", "")
    userClean = cleanUsername(user)
    if not instanceId or not userClean or not password:
        return jsonify({"error": "instanceId, user og password er tvunget"}), 400
    if len(userClean) >= 15:
        return jsonify({"error": "username for langt"}), 400
    try:
        rsp = supabase.table("users").select("username").eq("gameInstance", str(instanceId)).execute()
        rows = getattr(rsp, "data", []) or []
        existing = None
        for i in range(len(rows)):
            if userClean == rows[i].get("username"):
                existing = True
                break
            else:
                existing = False
        if existing:
            return jsonify({"error": "navnet eksistere alerrede"}), 409
        if HAVE_BCRYPT:
            stored = bcrypt.hash(password)
        else:
            stored = encrypt(cryptKey, password.encode('utf-8'))
        
        score = {
            "ettere": 0,
            "toere": 0,
            "treere": 0,
            "firere": 0,
            "femmere": 0,
            "seksere": 0,
            "sum": 0,
            "bonus": 0,
            "1par": 0,
            "2par": 8,
            "treens": 0,
            "fireens": 0,
            "lillestraight": 0,
            "storstraight": 0,
            "fuldthus": 0,
            "chance": 0,
            "yatzy": 0,
            "total": 0
        }
        
        insert_rsp = supabase.table("users").insert({
            "username": userClean,
            "password": stored,
            "gameInstance": instanceId,
            "score": score
        }).execute()
        rsp2 = supabase.table("users").select("id").eq("gameInstance", str(instanceId)).order("id", desc=True).execute()
        rows2 = getattr(rsp2, "data", []) or []
        for i in range(len(rows2) - 1):
            supabase.table("users").update({"turn": i }).eq("id", rows2[i].get("id")).execute()
        return jsonify({"login": True, "errorExists": False, "error": ""})
    except Exception as e:
        app.logger.exception("Error adding user")
        return jsonify({"error": "kunne ikke tilfoeje bruger", "detail": str(e)}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5328, debug=True)