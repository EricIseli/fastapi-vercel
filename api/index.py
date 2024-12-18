from fastapi import FastAPI, Query
from pathlib import Path
import json
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# CORS aktivieren
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wetterdaten laden
DATA_PATH = Path(__file__).parent / "meteodaten_2023_daily.json"
with open(DATA_PATH, encoding="utf-8") as file:
    meteodaten = json.load(file)

# Hilfsfunktion zur Berechnung der Woche
def get_week_data(data, selected_date, station):
    start_date = datetime.fromisoformat(selected_date) - timedelta(days=3)
    end_date = datetime.fromisoformat(selected_date) + timedelta(days=3)
    week_data = []

    for item in data:
        item_date = datetime.fromtimestamp(item["Datum"] / 1000)
        if start_date <= item_date <= end_date:
            if not station or item["Standortname"] == station:
                # Prüfen, ob die Koordinaten gültig sind
                if "WGS84_lat" in item and "WGS84_lng" in item:
                    week_data.append({
                        "Datum": item_date.isoformat(),
                        "T": item["T"],
                        "RainDur": item["RainDur"],
                        "Standortname": item["Standortname"],
                        "WGS84_lat": item["WGS84_lat"],
                        "WGS84_lng": item["WGS84_lng"],
                    })
    return week_data

# API-Endpunkt für Wochen-Daten
@app.get("/api/py/week")
def get_week(selected_date: str = Query(...), station: str = Query("")):
    week_data = get_week_data(meteodaten, selected_date, station)
    return {"week_data": week_data}

@app.get("/api/py/stations")
def get_all_stations():
    stations = list(set(item["Standortname"] for item in meteodaten if "Standortname" in item))
    return {"stations": stations}