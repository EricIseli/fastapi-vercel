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
} from "@mui/material";
import { useState } from "react";

const DataTable = ({
  data,
  loading,
  stations,
  onDateChange,
  onStationChange,
}) => {
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

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
            {stations.length > 0 ? (
              stations.map((station, index) => (
                <MenuItem key={index} value={station}>
                  {station}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Keine Stationen verfügbar</MenuItem>
            )}
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
      <TableContainer
        component={Paper}
        style={{ maxHeight: "180px", overflowY: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Datum</TableCell>
              <TableCell>Standort</TableCell>
              <TableCell>Temperatur</TableCell>
              <TableCell>RainDur</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Daten werden geladen...
                </TableCell>
              </TableRow>
            ) : (
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
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  stations: PropTypes.array.isRequired, // Neue Prop-Validierung
  onDateChange: PropTypes.func.isRequired,
  onStationChange: PropTypes.func.isRequired,
};

export default DataTable;
