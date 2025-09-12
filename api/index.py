from flask import Flask, redirect, jsonify
from flask_cors import CORS
import os
from supabase import create_client, Client
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

@app.route("/api/tjek/<instanceId>/time")
def serverTime(instanceId):
    i = 1
    while (supabase.table("server").select("instanceId").contains("id", [str(i)])) != None:
        time = (supabase.table("server").select("instanceId").contains("timeCreated",["timeCreated"]).execute())
        currentDate = localtime().tm_mday
        currentMonth = localtime().tm_mon
        instanceMonth = time[1]
        instanceDate = time[0]
        if currentMonth > instanceMonth or (currentMonth == instanceMonth and currentDate < instanceDate):
            instanceTime = (currentMonth - instanceMonth) * 30 + (instanceDate - currentDate)
        else:
            instanceTime = (12 - currentMonth + instanceMonth) * 30 + (instanceDate - currentDate)
        if instanceTime >= 7:
            return redirect(f"/server/{instanceId}", code=302)
        else:
            dltCollum = (supabase.table("server").delete().eq("id", i).execute())
    return jsonify({"exists":False})


@app.route("/api/tjek/<instanceId>/<name>/<password>")
def name_exists(instanceId, name):
    if instanceId in currentInstances:
        if name in players:
            return jsonify({"exists": True})
        players.append(name)
        return jsonify({"exists":False})
    return jsonify({"instanceExists":False})
