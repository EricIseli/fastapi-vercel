import { Container, Typography, Grid } from "@mui/material";
import DataTable from "./table";
import Map from "./Map";
import Chart from "./Chart";
import { useState, useEffect } from "react";
import "./styles.css";

const App = () => {
  const [data, setData] = useState([]);
  const [stations, setStations] = useState([]); // Liste aller Stationen
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Setzt das heutige Datum
  const [selectedStation, setSelectedStation] = useState("");

  // Lade alle verfügbaren Stationen beim Start
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/py/stations");
        if (!response.ok) {
          throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Verfügbare Stationen:", result.stations);
        setStations(result.stations);

        // Setzt die erste Station als Standardauswahl
        if (result.stations.length > 0) {
          setSelectedStation(result.stations[0]);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Stationen:", error);
        setError("Stationen konnten nicht geladen werden.");
      }
    };

    fetchStations();
  }, []);

  // Lade die Wetterdaten basierend auf Datum und Station
  useEffect(() => {
    const fetchFilteredData = async (date, station) => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/py/week?selected_date=${date}&station=${station}`
        );

        if (!response.ok) {
          throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result.week_data);
        setData(result.week_data);
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        setError("Daten konnten nicht geladen werden.");
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchFilteredData(selectedDate, selectedStation);
    }
  }, [selectedDate, selectedStation]);

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Wetterdaten 2023
      </Typography>

      {error && (
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      )}

      <DataTable
        data={data}
        loading={loading}
        stations={stations} // Übergabe der Stationen an die Tabelle
        onDateChange={(date) => setSelectedDate(date)}
        onStationChange={(station) => setSelectedStation(station)}
      />

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={6}>
          <Typography variant="h5" gutterBottom>
            Standortkarte
          </Typography>
          <Map data={data} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" gutterBottom>
            Temperaturverlauf der Woche
          </Typography>
          <Chart data={data} selectedDate={selectedDate} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
