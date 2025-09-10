from flask import Flask, redirect, jsonify
import jatzy

app = Flask(__name__)

currentInstances = []

@app.route("/api/opret")
def gameInstance():
    instanceId = jatzy.rndURL()
    currentInstances.append(instanceId)
    return redirect(f"/server/{instanceId}", code=302)

@app.route("/api/tjek/<instanceId>")
def instance_exists(instanceId):
    if instanceId in currentInstances:
        return jsonify({"exists": true})