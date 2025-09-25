from flask import Flask, redirect, jsonify
from flask_cors import CORS
import os
from supabase import create_client, Client
from datetime import date
from time import localtime
from random import uniform
import base64
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto import Random

cryptKey = b"dvawdbabdkawje802v354u0ba+d23u82nmyvn30cn2039xm234vn7"

url: str = os.environ.get('DATABASE_URL')
key: str = os.environ.get('DATABASE_KEY')
supabase: Client = create_client(url, key)

app = Flask(__name__)
CORS(app)
def rndURL():
    i = 0
    s = ""
    while(i < 6):
        rndNr = int(uniform(0, 9)) + 48
        s += chr(rndNr)
        i += 1
    return s

def cleanUsername(name):
    nameLen = len(name)
    i = 0
    while i < nameLen:
        if i == 0:
            continue
        if name[i] == ' ' and name[i - 1] == ' ':
            del name[i]
    return name.strip()

def encrypt(key, source, encode=True):
    key = SHA256.new(key).digest()  # use SHA-256 over our key to get a proper-sized AES key
    IV= Random.new().read(AES.block_size)  # generate IV
    encryptor = AES.new(key, AES.MODE_CBC, IV)
    padding = AES.block_size - len(source) % AES.block_size  # calculate needed padding
    source += bytes([padding]) * padding  # Python 2.x: source += chr(padding) * padding
    data = IV + encryptor.encrypt(source)  # store the IV at the beginning and encrypt
    return base64.b64encode(data).decode("latin-1") if encode else data

def decrypt(key, source, decode=True):
    if decode:
        source = base64.b64decode(source.encode("latin-1"))
    key = SHA256.new(key).digest()  # use SHA-256 over our key to get a proper-sized AES key
    IV = source[:AES.block_size]  # extract the IV from the beginning
    decryptor = AES.new(key, AES.MODE_CBC, IV)
    data = decryptor.decrypt(source[AES.block_size:])  # decrypt
    padding = data[-1]  # pick the padding value from the end; Python 2.x: ord(data[-1])
    if data[-padding:] != bytes([padding]) * padding:  # Python 2.x: chr(padding) * padding
        raise ValueError("Invalid padding...")
    return data[:-padding]  # remove the padding

players = ["Torben", "test"]
@app.route("/api/opret")
def gameInstance():
    instanceId = rndURL()
    instanceStartTime = [localtime().tm_mday, localtime().tm_mon]
    response = (supabase.table("server").insert({"instanceId": instanceId, "timeCreated": instanceStartTime}).execute())
    return redirect(f"/server/{instanceId}", code=302)

@app.route("/api/tjek/<instanceId>")
def instance_exists(instanceId):
    rsp = (supabase.table("server").select("*").eq("instanceId", str(instanceId)).execute())
    rows = getattr(rsp, "data", None) or (rsp.get("data") if isinstance(rsp, dict) else None)
    exists = bool(rows and len(rows) > 0)
    return jsonify({"exists": exists})

@app.route("/api/data/<instanceId>", methods=["GET"])
def get_data(instanceId):
    rsp = supabase.table("server").select("*").eq("instanceId", str(instanceId)).execute()
    players = getattr(rsp, "data", None) or (rsp.get("data") if isinstance(rsp, dict) else None)
    return jsonify({
        "instanceId": instanceId,
        "players": players
    })

@app.route("/api/tjek/tid")
def serverTime():
    resp = supabase.table("server").select("id,timeCreated").execute()
    rows = getattr(resp, "data", None) or (resp.get("data") if isinstance(resp, dict) else None)
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
        instanceDay, instanceMonth = int(tc[0]), int(tc[1])
        year = now.year if instanceMonth <= now.month else now.year - 1
        try:
            instanceDate = date(year, instanceMonth, instanceDay)
        except Exception:
            continue
        daysOld = (now - instanceDate).days
        if daysOld >= 7:
            supabase.table("server").delete().eq("id", row.get("id")).execute()
            deletedCount += 1
    return jsonify({"deleted": deletedCount, "checked": checked})

@app.route("/api/tjek/<name>")
def name_exists(name):
    if name in players:
        return jsonify({"exists": True})
    return jsonify({"exists":False})

@app.route("/api/tilfoej/<instanceId>/<user>/<password>")
def addUser(instanceId, user, password):
    if not subabase.table("users").select("*").in_("username", [cleanUsername(user)]).execute() and len(cleanUsername(user))< 11:
        user = (supabase.table("users").insert({"username": cleanUsername(user), "password": encrypt(cryptKey, password), "gameInstance": instanceId}))
        return redirect(f"/server/{instanceId}", code=302)
    return jsonify({"nameExist":True})
    