from supabase import create_client, Client
import os

url: str = os.environ.get('https://whaiekidzkrnqiyykhjr.supabase.co')
key: str = os.environ.get('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYWlla2lkemtybnFpeXlraGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NjE0NTQsImV4cCI6MjA3MzIzNzQ1NH0.luGyAzMASyma0kYS2n8kZs6MUrzEyneJTuM3LbX3AXc')
if not url or not key:
    raise RuntimeError("DATABASE_URL and DATABASE_KEY must be set as environment variables")

supabase: Client = create_client(url, key)

def get_data(instanceId):
    try:
        currentPlayers = []
        rsp = supabase.table("users").select("*").eq("gameInstance", str(instanceId)).order("score", desc=True).execute()
        rows = getattr(rsp, "data", []) or []
        bestPlayer = rows[0][1]
        worstPlayer = rows[len(rows) - 1][1]
        for i in range(len(rows) - 1):
            if rows[i][5] == True:
                currentPlayers.append(rows[i][1])
        return jsonify({
            "bestPlayer": bestPlayer,
            "worstPlayer": worstPlayer,
            "players": currentPlayers
        })
    except Exception as e:
        app.logger.exception("Error getting data")
        return jsonify({"error": "Failed to get instance data", "detail": str(e)}), 500

get_data(123456)