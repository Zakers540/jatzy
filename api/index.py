from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import os
from supabase import create_client, Client
from datetime import date
from time import localtime
import random
import string
import base64
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto import Random
import re

try:
    from passlib.hash import bcrypt
    HAVE_BCRYPT = True
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

@app.route("/api/logud", methods=["GET"])
def logud():
    try:
        data = request.get_json(silent=True) or {}
        user = data.get("username", "")
        supabase.table("users").update({"online": False}).eq("username", user).execute()
    except Exception as e:
        app.logger.exception("error logout")
        return jsonify({"error": "failed to logout", "detail": str(e)}), 500
    
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
            "players": []
        })

        bestPlayer = rows[0].get("username")
        worstPlayer = rows[len(rows)].get("username")
        for i in range(len(rows)):
            if rows[i].get("online") == True:
                currentPlayers.append(rows[i].get("username"))
        return jsonify({
            "bestPlayer": bestPlayer,
            "worstPlayer": worstPlayer,
            "players": currentPlayers
        })
    except Exception as e:
        app.logger.exception("Error getting data")
        return jsonify({"error": "Failed to get instance data", "detail": str(e)}), 500

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
                    deletedCount += 1
            except Exception:
                app.logger.exception("Error processing row")
                continue
        return jsonify({"deleted": deletedCount, "checked": checked})
    except Exception as e:
        app.logger.exception("Error in serverTime")
        return jsonify({"error": "Failed to check server times", "deleted": 0, "checked": 0}), 500

@app.route("/api/tjek/<name>", methods=["GET"])
def name_exists(name):
    cleaned = cleanUsername(name)
    return jsonify({"exists": cleaned in players})

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
        rsp = supabase.table("users").select("*").eq("username", userClean).execute()
        existing = getattr(rsp, "data", []) or []
        if existing:
            return jsonify({"error": "navnet eksistere alerrede"}), 409
        if HAVE_BCRYPT:
            stored = bcrypt.hash(password)
        else:
            stored = encrypt(cryptKey, password.encode('utf-8'))
        insert_rsp = supabase.table("users").insert({
            "username": userClean,
            "password": stored,
            "gameInstance": instanceId
        }).execute()
        return jsonify({"login": True, "errorExists": False, "error": ""})
    except Exception as e:
        app.logger.exception("Error adding user")
        return jsonify({"error": "kunne ikke tilfoeje bruger", "detail": str(e)}), 500
