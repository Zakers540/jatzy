# Flask + CORS for webserver og cross-origin requests
from flask import Flask, request, redirect, jsonify
from flask_cors import CORS

# OS for env-variabler
import os

# Supabase klient
from supabase import create_client, Client

# dato/tid
from datetime import date
from time import localtime

# standardbiblioteker
import asyncio
import random
import string
import base64
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto import Random
import re

# prøver at importere bcrypt fra passlib; hvis ikke tilgængelig fallbacks til AES
try:
    from passlib.hash import bcrypt
    HAVE_BCRYPT = True
except Exception:
    HAVE_BCRYPT = False
    print("passlib not available: falling back to AES")

cryptKey = b"dvawdbabdkawje802v354u0ba+d23u82nmyvn30cn2039xm234vn7"

# Henter Supabase credentials fra miljø, giver advarsel hvis ikke sat
url: str = os.environ.get('DATABASE_URL')
key: str = os.environ.get('DATABASE_KEY')
if not url or not key:
    print("Warning: Using default Supabase credentials. Set DATABASE_URL and DATABASE_KEY environment variables for production.")
# Initialiserer Supabase client
supabase: Client = create_client(url, key)

app = Flask(__name__)
CORS(app)

fields = [
            "ettere","toere","treere","firere","femmere","seksere",
            "sum","bonus","1par","2par","treens","fireens",
            "lillestraight","storstraight","fuldthus","chance","yatzy","total"
        ]

# returner 6 random numrer til instanceId
def rndURL(length: int = 6) -> str:
    return ''.join(random.choices(string.digits, k=length))

#søger for at usernamet er i det rigtige format
def cleanUsername(name: str) -> str:
    if not isinstance(name, str):
        return ""
    name = re.sub(r'\s+', ' ', name).strip()
    name = re.sub(r'[^A-Za-z0-9 _\-]', '', name)
    return name

def encrypt(key: bytes, source: bytes, encode: bool = True) -> str:
    key_h = SHA256.new(key).digest()                      # laver en 256-bit nøgle fra key (SHA256)
    IV = Random.new().read(AES.block_size)                # init vector (AES block size)
    encryptor = AES.new(key_h, AES.MODE_CBC, IV)          # AES-CBC cifrer instans
    padding = AES.block_size - (len(source) % AES.block_size)
    source_padded = source + bytes([padding]) * padding   # PKCS#7-lignende padding
    data = IV + encryptor.encrypt(source_padded)          # gem IV foran krypteret payload
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
    """
    opretter en ny spil-instance:
    - genererer instanceId og gemmer tid (dag, måned) i server-tabellen
    - redirecter klienten til /server/{instanceId}
    - Returnerer 500 ved fejl
    """
    instanceId = rndURL()
    instanceStartTime = [localtime().tm_mday, localtime().tm_mon]
    try:
        rsp = supabase.table("server").insert({"instanceId": instanceId, "timeCreated": instanceStartTime}).execute()
        return redirect(f"/server/{instanceId}", code=302)
    except Exception as e:
        return jsonify({"error": "Failed to create instance", "detail": str(e)}), 500


@app.route("/api/tjek/<instanceId>", methods=["GET"])
def instance_exists(instanceId):
    """
    tjekker om en instance med instanceId findes i server-tabellen.
    returnerer JSON: {"exists": True/False}
    """
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
    """
    logout
    - forventer JSON med username, password, instanceId
    - henter brugerens password fra DB og tjekker mod indsendt password
    - sætter online = false for brugeren hvis password ok
    """
    try:
        # support JSON POST or query param for convenience
        data = request.get_json(silent=True) or {}
        user = data.get("username") or ""
        passwd = data.get("password") or ""
        id = data.get("instanceId") or ""
        if not data:
            return jsonify({"error": "json required"}), 400
        rsp = supabase.table("users").select("password").eq("gameInstance", str(id)).eq("username", user).execute()
        dataRSP = getattr(rsp, "data", []) or []
        if not dataRSP:
            return jsonify({"error": "req failed"}), 430

        if not bcrypt.checkpw(passwd, dataRSP.get("password")):
            return jsonify({"error": "wrong password"}), 440

        supabase.table("users").update({"online": False}).eq("username", user).execute()
        return jsonify({"loggedIn": False})
    except Exception as e:
        app.logger.exception("error logout")
        return jsonify({"error": "failed to logout", "detail": str(e)}), 500


@app.route("/api/whoami", methods=["GET"]) 
def whoami():
    """
    returnerer info om en bruger i en instance:
    - forventer query params instanceId og username
    - henter username, online, turn og score fra users-tabellen
    - returnerer exists True/False og user-data hvis fundet
    """
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
    """
    henter spil-relaterede data for en instance:
    - læser alle users for instance og forsøger at finde bestPlayer, worstPlayer og currentPlayer
    - returnerer JSON med best/worst og players
    """
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

        # find best og worst baseret på score.total
        j = 1
        bestPlayer = rows[0]
        worstPlayer = rows[0]
        while j < len(rows):           
            if rows[j].get("score").get("total") > bestPlayer.get("score").get("total"):
                bestPlayer = rows[j]
            if rows[j].get("score").get("total") < worstPlayer.get("score").get("total"):
                worstPlayer = rows[j]
            j += 1

        # hent server turn for at finde current player
        srv = supabase.table("server").select("turn").eq("instanceId", str(instanceId)).execute()
        Srows = getattr(srv, "data", []) or []
        if not Srows:
            return jsonify({"error": "instanceId does not have a turn", "players": []}), 404
        currentTurnVal = Srows[0].get("turn")

        # find index i users hvor turn matcher server-turn
        currentIndex = 0
        while currentIndex < len(rows):
            if rows[currentIndex].get("turn") == currentTurnVal:
                break
            currentIndex += 1
        currentPlayer = rows[currentIndex]

        # returnerer best/worst,men players returneres som currentPlayers
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
    """
    Returnerer 'turn' for en given instanceId fra server-tabellen.
    """
    try:
        rsp = supabase.table("server").select("turn").eq("instanceId", str(instanceId)).execute()
        rows = getattr(rsp, "data", []) or []

        if not rows:
            return jsonify({"errorExists": True, "error": "No data found for this instanceId"}), 404

        tur = rows[0].get("turn")
        return jsonify({"turn": tur})
    except Exception as e:
        return jsonify({"errorExists": True ,"error": "tur Failed", "detail": str(e)}), 500


@app.route("/api/yatzyScore/<instanceId>/<clickedPlayerName>", methods=["GET","POST"])
def playerScore(instanceId, clickedPlayerName):
    """
    returnerer score for en specifik spiller i en instance.
    - henter kolonner score, username, gameInstance og returnerer 'userScore'
    """
    rsp = supabase.table("users").select("score, username, gameInstance").eq("gameInstance", str(instanceId)).eq("username", clickedPlayerName).execute()
    rows = getattr(rsp, "data", []) or []
    if not rows:
        return jsonify({"error": "no users for instance", "players": []}), 404
    
    userScore = rows[0].get("score", {})

    return jsonify({"userScore": userScore})


@app.route("/api/jatzySheet/<instanceId>/<name>", methods=["GET","POST"])
def scoreSheet(instanceId, name):
    """
    genererer et 'score sheet' som clienten kan bruge til at vise:
    - best/worst/current og score-værdier for: user, currentPlayer, bestPlayer, worstPlayer
    - resetter også terninger i server-tabellen til tilfældige værdier
    """
    try:
        # hent brugere for instance, sorteret efter score
        rsp = supabase.table("users").select("score, username, turn").eq("gameInstance", str(instanceId)).order("score", desc=True).execute()
        rows = getattr(rsp, "data", []) or []
        if not rows:
            return jsonify({"error": "no users for instance", "players": []}), 404

        # find best og worst baseret på score.total, konverterer til int når muligt
        j = 1
        bestPlayer = rows[0]
        worstPlayer = rows[0]
        while j < len(rows):
            if rows[j].get("score").get("total") is not None:          
                if int(rows[j].get("score").get("total")) > int(bestPlayer.get("score").get("total")):
                    bestPlayer = rows[j]
                if int(rows[j].get("score").get("total")) < int(worstPlayer.get("score").get("total")):
                    worstPlayer = rows[j]
            else:
                worstPlayer = rows[j]
            j += 1

        # hent server-turn
        srv = supabase.table("server").select("turn").eq("instanceId", str(instanceId)).execute()
        Srows = getattr(srv, "data", []) or []
        if not Srows:
            return jsonify({"error": "instanceId does not have a turn", "players": []}), 404
        currentTurnVal = Srows[0].get("turn")

        # find currentPlayer ud fra turn-feltet
        currentIndex = 0
        while currentIndex < len(rows):
            if rows[currentIndex].get("turn") == currentTurnVal:
                break
            currentIndex += 1
        currentPlayer = rows[currentIndex]

        # find "user" rækken for navnet 'name'
        i = 0
        user = None
        while i < len(rows):
            if rows[i].get("username") == name:
                user = rows[i]
                break
            i += 1

        #hvis brugeren ikke findes, vælg første række
        if user is None:
            user = rows[0]

        def getScoreField(record, field):
            scoreObj = record.get("score") or {}
            val = scoreObj.get(field, 0)
            try:
                return int(val)
            except Exception:
                return 0

        # spillere til sheet: [user, currentPlayer, bestPlayer, worstPlayer]
        playersList = [
            user.get("username"),
            currentPlayer.get("username"),
            bestPlayer.get("username"),
            worstPlayer.get("username"),
        ]

        # bygger selve 'sheet' objektet, for hvert felt, 4 kolonner med værdier
        sheet = {}
        for f in fields:
            sheet[f] = {
                "0": getScoreField(user, f),
                "1": getScoreField(currentPlayer, f),
                "2": getScoreField(bestPlayer, f),
                "3": getScoreField(worstPlayer, f),
            }
        
        # bygger plist, starter med currentPlayer så alle andre (debug prints bruges)
        Plist = [playersList[1]]
        j = 0
        while j < len(rows):
            print(rows[j].get("username"))
            if rows[j].get("username") != playersList[1]:
                Plist.append(rows[j].get("username"))
            j += 1
        print(Plist)

        # reset 5 terninger (tilfældige 1..6) og gem i server-tabellen
        resetDice = [random.randint(1, 6),random.randint(1, 6),random.randint(1, 6),
                     random.randint(1, 6),random.randint(1, 6)]

        result = {"currentPlayer":Plist,"bestPlayer":playersList[2],"worstPlayer":playersList[3], "yatzySheet": sheet}

        supabase.table("server").update({"dice": resetDice }).eq("instanceId", str(instanceId)).execute()

        return jsonify(result)
    except Exception as e:
        app.logger.exception("yatzySheet Failed")
        return jsonify({"errorExists": True, "error": "yatzySheet Failed", "detail": str(e)}), 500


@app.route("/api/rul/terning<int:which>", methods=["POST"])
def roll_die(which):
    """
    ruller en enkelt terning (which fra 1 til 5):
    - forventer JSON med instanceId og user
    - opdaterer den valgte terning i server dice og returnerer den nye værdi
    """
    try:
        data = request.get_json() or {}
        instanceId = data.get("instanceId")
        user = data.get("user")

        if not instanceId or not user:
            return jsonify({"error": "Missing instanceId or user"}), 400

        # henter 'dice' array fra server-tabellen
        rsp = supabase.table("server").select("dice").eq("instanceId", str(instanceId)).single().execute()
        dice = rsp.data.get("dice", [1, 2, 3, 4, 5])  # default hvis ingen dice

        # rul terningen (index = which-1)
        dice[which - 1] = random.randint(1, 6)
        supabase.table("server").update({"dice": dice}).eq("instanceId", str(instanceId)).execute()

        return jsonify({"dice": dice[which - 1]})
    
    except Exception as e:
        app.logger.exception("Roll die failed")
        return jsonify({"error": str(e)}), 500


@app.route("/api/tryk/<instanceId>/<name>", methods=["POST"])
def update(instanceId, name):
    """
    opdaterer en spillers score når de 'trykker':
    - forventer JSON med 'category' og 'score' i body
    - tjekker om feltet allerede er sat; hvis ikke opdateres score-objektet
    - genberegner sum, bonus og total og gemmer i users-tabellen
    - opdaterer server.turn (ruller til næste spiller)
    """
    try:
        data = request.get_json(silent=True) or {}
        rsp = supabase.table("users").select("score, username").eq("gameInstance", str(instanceId)).eq("username", name).execute()
        srv = supabase.table("server").select("turn").eq("instanceId", str(instanceId)).execute()
        
        sRows = getattr(srv, "data", []) or []
        if not sRows:
            return jsonify({"errorExists": True, "error": "gameInstance not found"}), 404

        rows = getattr(rsp, "data", []) or []
        if not rows:
            return jsonify({"errorExists": True, "error": "User not found"}), 404

        field = data.get("category")
        score = rows[0].get("score") or {}

        # hvis felt allerede er sat
        if score.get(field) is not None:
            return jsonify({"errorExists": True, "error": f"Category '{field}' already set"}), 409

        # beregn ny turn (increment eller reset til 0)
        turn = sRows[0].get("turn")
        if turn < len(rows):
            updatedTurn = turn + 1
        else:
            updatedTurn = 0

        print(f"updated turn{updatedTurn}")

        # sæt score for det valgte felt
        # if field in score: else: invalid field
        if field in score:
            score[field] = data.get("score")
        else:
            return jsonify({"errorExists": True, "error": f"Invalid field: {field}"}), 400

        # genberegn øvre sum (ettere..seksere)
        halfField = ["ettere","toere","treere","firere","femmere","seksere"]

        scoreSum = 0
        for hf in halfField:
            if score.get(hf) is not None:
                scoreSum += int(score.get(hf))
            else:
                scoreSum += 0

        score["sum"] = scoreSum
        #tildeler bonus kun når sum >= 63 
        if int(score.get("sum")) >= 63:
            score["bonus"] = 35

        # beregn total over alle felter
        total = 0
        for f in fields:
            if f != "total" and score.get(f) is not None: 
                t = int(score.get(f))
                total += t
            else:
                total += 0
        
        # gemmer total som streng
        score["total"] = str(total)

        # gem i DB og opdater server.turn
        supabase.table("users").update({"score": score}).eq("username", name).eq("gameInstance", str(instanceId)).execute()
        supabase.table("server").update({"turn": updatedTurn}).eq("instanceId", str(instanceId)).execute()
 
        return jsonify({"errorExists": False, "error":""})
    except Exception as e:
        app.logger.exception("score update Failed")
        return jsonify({"errorExists": True, "error": "score update Failed", "detail": str(e)}), 500


@app.route("/api/tjek/tid", methods=["GET"])
def serverTime():
    """
    gennemgår server-tabellen og sletter instanser der er ældre end 7 dage:
    - timeCreated forventes som [dag, måned]
    - Beregner daysOld
    - Hvis >=7 dage: sletter server-row og tilknyttede users
    - Returnerer antal slettede og tjekkede rækker
    """
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
            # forventer liste/tuple med mindst 2 elementer (dag, måned)
            if not tc or not isinstance(tc, (list, tuple)) or len(tc) < 2:
                continue
            try:
                instanceDay, instanceMonth = int(tc[0]), int(tc[1])
                #hvis instanceMonth er senere end nu.month, antager vi at oprettelsen var sidste år
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
    """
    tilføjer en ny bruger til en instance:
    - forventer JSON med instanceId, user og password
    - renser brugernavn, tjekker længde og om det allerede findes
    - gemmer password enten som bcrypt-hash (hvis HAVE_BCRYPT True) eller som AES-encrypted streng (fallback)
    - indsætter en række i users-tabellen med initialiseret score-objekt
    - updaterer alle brugere i instance så deres 'turn' felt sættes til indeks i rækkefølgen
    """
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
        # hent eksisterende brugernavne for instance
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

        # gem password (bcrypt hvis muligt; ellers AES-encrypt fallback)
        if HAVE_BCRYPT:
            stored = bcrypt.hash(password)
        else:
            stored = encrypt(cryptKey, password.encode('utf-8'))
        
        # initielt score-objekt
        score = {
            "ettere": None,
            "toere": None,
            "treere": None,
            "firere": None,
            "femmere": None,
            "seksere": None,
            "sum": None,
            "bonus": None,
            "1par": None,
            "2par": None,
            "treens": None,
            "fireens": None,
            "lillestraight": None,
            "storstraight": None,
            "fuldthus": None,
            "chance": None,
            "yatzy": None,
            "total": None
        }
        
        # indsæt ny bruger
        insertRsp = supabase.table("users").insert({
            "username": userClean,
            "password": stored,
            "gameInstance": str(instanceId),
            "score": score
        }).execute()

        # opdater turn for alle brugere i instance
        rsp2 = supabase.table("users").select("id").eq("gameInstance", str(instanceId)).order("id", desc=True).execute()
        rows2 = getattr(rsp2, "data", []) or []
        for i in range(len(rows2)):
            supabase.table("users").update({"turn": i }).eq("id", rows2[i].get("id")).execute()
        return jsonify({"login": True, "errorExists": False, "error": ""})
    except Exception as e:
        app.logger.exception("Error adding user")
        return jsonify({"error": "kunne ikke tilfoeje bruger", "detail": str(e)}), 500


# start app hvis scriptet køres direkte
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5328, debug=True)