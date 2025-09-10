from flask import Flask, redirect, jsonify
import random

app = Flask(__name__)

def rndURL():
    i = 0
    s = ""
    while(i < 6):
        rndNr = int(random.uniform(0, 9)) + 48 
        if(rndNr >= 48 and rndNr <= 57):
            s += chr(rndNr)
            i += 1
    return s

currentInstances = []

@app.route("/api/opret")
def gameInstance():
    instanceId = jatzy.rndURL()
    currentInstances.append(instanceId)
    return redirect(f"/server/{instanceId}", code=302)

@app.route("/api/tjek/<instanceId>")
def instance_exists(instanceId):
    exists = instanceId in currentInstances
    return jsonify({"exists": exists})

@app.route("/api/test")
def test():
    return "<p>Hello world!</p>"
