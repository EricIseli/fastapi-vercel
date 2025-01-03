from fastapi import FastAPI, Query
import json
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("C:/Projects_WebDiv/fastapi-vercel/api/meteodaten_2023_daily.json", encoding="utf-8") as file:
    meteodaten = json.load(file)

def get_week_data(data, selected_date, station):
    selected_date_obj = datetime.fromisoformat(selected_date)
    start_date = selected_date_obj - timedelta(days=3)
    end_date = selected_date_obj + timedelta(days=3)

    week_data = []
    for item in data:
        entry_date = datetime.fromtimestamp(item["Datum"] / 1000)
        if start_date <= entry_date <= end_date and item["Standortname"] == station:
            week_data.append({
                "Datum": entry_date.isoformat(),
                "T": item["T"],
                "RainDur": item["RainDur"],
                "Standortname": item["Standortname"],
                "WGS84_lat": item.get("WGS84_lat"),
                "WGS84_lng": item.get("WGS84_lng"),
            })

    return week_data


# Durchschnittswerte berechnen
def calculate_average(data):
    if not data:
        return {"avg_temp": None, "avg_rain_dur": None}
    avg_temp = sum(item["T"] for item in data) / len(data)
    avg_rain_dur = sum(item["RainDur"] for item in data) / len(data)
    return {"avg_temp": avg_temp, "avg_rain_dur": avg_rain_dur}

# Endpunkt: Wochen-Daten
@app.get("/api/py/week")
def get_week(selected_date: str = Query(...), station: str = Query("")):
    week_data = get_week_data(meteodaten, selected_date, station)
    averages = calculate_average(week_data)

    return {
        "week_data": week_data,
        "average": {
            "avg_temp": averages["avg_temp"],
            "total_rain_dur": averages["avg_rain_dur"]
        }
    }


# Endpunkt: Alle Stationen
@app.get("/api/py/stations")
def get_all_stations():
    stations = list({item["Standortname"] for item in meteodaten})
    return {"stations": sorted(stations)}