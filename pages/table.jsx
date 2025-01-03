import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";

const DataTable = ({ data, stations, onDateChange, onStationChange }) => {
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedDate, setSelectedDate] = useState("2023-01-01");

  const handleStationChange = (event) => {
    const station = event.target.value;
    setSelectedStation(station);
    onStationChange(station);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <FormControl style={{ minWidth: 200 }}>
          <InputLabel>Wetterstation</InputLabel>
          <Select value={selectedStation} onChange={handleStationChange}>
            {stations.map((station, index) => (
              <MenuItem key={index} value={station}>
                {station}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="date"
          label="Datum"
          InputLabelProps={{ shrink: true }}
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>
      {/* Titel der Tabelle */}
      <Typography className="section-title">Wochenübersicht</Typography>
      <TableContainer
        component={Paper}
        style={{ maxHeight: "200px", overflowY: "auto" }} // Begrenzte Höhe und Scrollbar
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                Datum
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                Standort
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                Temperatur
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                Niederschlagsdauer
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(row.Datum).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{row.Standortname}</TableCell>
                  <TableCell>{row.T} °C</TableCell>
                  <TableCell>{row.RainDur} min</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Keine Daten verfügbar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  stations: PropTypes.array.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onStationChange: PropTypes.func.isRequired,
};

export default DataTable;
