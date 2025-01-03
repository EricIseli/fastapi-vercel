import React, { useState, useEffect } from "react";
import DataTable from "./table";
import Map from "./Map";
import Chart from "./Chart";
import { Slider, Typography } from "@mui/material";
import "./styles.css";

const App = () => {
  const [data, setData] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedDate, setSelectedDate] = useState("2023-01-01");
  const [average, setAverage] = useState({
    avg_temp: null,
    total_rain_dur: null,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    const fetchStations = async () => {
      const response = await fetch("/api/py/stations");
      const result = await response.json();
      setStations(result.stations);
    };
    fetchStations();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/py/week?selected_date=${selectedDate}&station=${selectedStation}`
      );
      const result = await response.json();
      setData(result.week_data);
      setAverage(result.average); // Durchschnittswerte setzen
    };
    fetchData();
  }, [selectedStation, selectedDate]);

  // Debugging: Daten überprüfen
  console.log("Daten, die an VegaLite übergeben werden:", data);

  return (
    <div className="app-container">
      <div className="title-container">
        <h1 className="title">Wetterdaten Zürich 2023</h1>
      </div>
      {!selectedStation || !selectedDate ? (
        <p className="info-message">
          Bitte wählen Sie eine Wetterstation und ein Datum aus, um die Daten
          anzuzeigen.
        </p>
      ) : null}

      <DataTable
        data={data}
        stations={stations}
        onDateChange={setSelectedDate}
        onStationChange={setSelectedStation}
      />

      {/* Durchschnittswerte unter der Tabelle */}
      <div className="average-container">
        {average.avg_temp !== null && (
          <p>
            Durchschnittstemperatur der Woche: {average.avg_temp.toFixed(2)}°C
          </p>
        )}
        {average.total_rain_dur !== null && (
          <p>
            Gesamte Niederschlagsdauer der Woche:{" "}
            {average.total_rain_dur.toFixed(2)} min
          </p>
        )}
      </div>
      <div className="content-container">
        <div className="map-container">
          <Map data={data} selectedStation={selectedStation} />
        </div>
        <div className="chart-container">
          <Chart data={data} />
        </div>
      </div>
    </div>
  );
};

export default App;
