from flask import Flask, redirect, jsonify
from flask_cors import CORS
import os
from supabase import create_client, Client
from datetime import date
from time import localtime
from random import uniform

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


players = []
currentInstances = [] # evenIndex = gameInstance, unevenIndex = instanceTime[date, month]

players = ["Torben", "test"]
@app.route("/api/opret")
def gameInstance():
    instanceId = rndURL()
    instanceStartTime = [localtime().tm_mday, localtime().tm_mon]
    response = (supabase.table("server").insert({"instanceId": instanceId, "timeCreated": instanceStartTime}).execute())
    create = supabase.rpc("private.instanceUsers", {"instance_id": instanceId}).execute()
    return redirect(f"/server/{instanceId}", code=302)

@app.route("/api/tjek/<instanceId>")
def instance_exists(instanceId):
    exists = (supabase.table("server").select("*").in_("instanceId", [str(instanceId)]).execute())
    return jsonify({"exists": exists})

@app.route("/api/data/<instanceId>", methods=["GET"])
def get_data(instanceId):
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

@app.route("/api/tjek/<instanceId>/<name>")
def name_exists(instanceId, name):
    if instanceId in currentInstances:
        if name in players:
            return jsonify({"exists": True})
        players.append(name)
        return jsonify({"exists":False})
    return jsonify({"instanceExists":False})
