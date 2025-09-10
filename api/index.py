from flask import Flask, redirect
import jatzy

app = Flask(__name__)

currentInstances = []

@app.route("/api/opret")
def gameInstance():
    instanceId = jatzy.rndURL()
    currentInstances.append(instanceId)
    return redirect(f"/server/{instanceId}", code=302)
    
@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"