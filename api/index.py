from flask import Flask, redirect, jsonify
import jatzy

from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

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

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5528, debug=True)
    app.run(host="127.0.0.1", port=5328, debug=True)
