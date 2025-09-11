from flask import Flask, redirect, jsonify
from flask_cors import CORS
import datetime
from random import uniform

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
currentInstances = [] # evenIndex = gameInstance, unevenIndex = instanceTime

players = ["Torben", "test"]
@app.route("/api/opret")
def gameInstance():
    instanceId = rndURL()
    currentInstances.append(instanceId)
    day = datetime.datetime.now()
    currentInstances.append(day.date)
    return redirect(f"/server/{instanceId}", code=302)

@app.route("/api/tjek/<instanceId>")
def instance_exists(instanceId):
    exists = instanceId in currentInstances
    return jsonify({"exists": exists})

@app.route("/api/data/<instanceId>", methods=["GET"])
def get_data(instanceId):
    return jsonify({
        "instanceId": instanceId,
        "players": players
    })

@app.route("/api/tjek/<instanceId>/time")
def serverTime(instanceId):
    if instanceId in currentInstances:
        index = currentInstances.index(instanceId)
        currentDay = datetime.datetime.now()
        if currentDay.date - currentInstances[index + 1] >= 7:
            return redirect(f"/server/{instanceId}", code=302)
        else:
            currentInstances.remove(index)
            currentInstances.remove(index + 1)
    return jsonify({"exists":False})


@app.route("/api/tjek/<instanceId>/<name>")
def name_exists(instanceId, name):
    if name in players:
        return jsonify({"exists": True})
    players.append(name)
    return jsonify({"exists":False})
