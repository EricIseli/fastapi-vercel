import React from "react";
import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";
import "chart.js/auto";

// Hilfsfunktion zur Berechnung der Woche
const getWeekData = (data, selectedDate) => {
  const selectedTimestamp = new Date(selectedDate).setHours(0, 0, 0, 0); // Startdatum ohne Uhrzeit
  const startOfWeek = selectedTimestamp - 3 * 24 * 60 * 60 * 1000; // 3 Tage zurück
  const endOfWeek = selectedTimestamp + 3 * 24 * 60 * 60 * 1000; // 3 Tage vorwärts

  return data.filter((item) => {
    const itemDate = new Date(item.Datum).setHours(0, 0, 0, 0); // ISO-String zu Datum ohne Uhrzeit
    return itemDate >= startOfWeek && itemDate <= endOfWeek;
  });
};

const ChartComponent = ({ data, selectedDate }) => {
  // Berechne die Daten für die Woche des ausgewählten Datums
  const weeklyData = getWeekData(data, selectedDate);

  // Labels und Temperaturen für das Diagramm vorbereiten
  const labels = weeklyData.map((item) =>
    new Date(item.Datum).toLocaleDateString("de-DE", { weekday: "long" })
  );
  const temperatures = weeklyData.map((item) => item.T);

  // Chart.js Konfiguration
  const chartData = {
    labels,
    datasets: [
      {
        label: "Temperatur (°C)",
        data: temperatures,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div style={{ height: "400px" }}>
      {weeklyData.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <p>
          Keine Daten für die Woche vom{" "}
          {new Date(selectedDate).toLocaleDateString()} verfügbar.
        </p>
      )}
    </div>
  );
};

ChartComponent.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Datum: PropTypes.number.isRequired,
      T: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedDate: PropTypes.string.isRequired, // Format YYYY-MM-DD
};

export default ChartComponent;
