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
    exists = instanceId in currentInstances
    return jsonify({"exists": exists})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5528, debug=True)