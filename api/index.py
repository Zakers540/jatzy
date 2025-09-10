from flask import Flask, redirect, jsonify
import jatzy

app = Flask(__name__)

@app.route("/api/opret")
def gameInstance():
    instanceId = jatzy.rndURL()
    return redirect(f"/server/{instanceId}", code=302)

@app.route("/api/tjek/<instanceId>")
def instance_exists(instanceId):
    exists = instanceId in currentInstances
    return jsonify({"exists": exists})