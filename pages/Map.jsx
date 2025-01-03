import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

let L;
if (typeof window !== "undefined") {
  L = require("leaflet");
}

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const Map = ({ data }) => {
  const [isClient, setIsClient] = useState(false);
  const [customIcon, setCustomIcon] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && L) {
      setCustomIcon(
        L.icon({
          iconUrl: "/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      );
    }
    setIsClient(true);
  }, []);

  const defaultPosition = [47.3769, 8.5417];

  const centerPosition =
    data.length > 0
      ? [
          data[0].WGS84_lat || defaultPosition[0],
          data[0].WGS84_lng || defaultPosition[1],
        ]
      : defaultPosition;

  return (
    <div className="map-container" style={{ width: "50%", height: "400px" }}>
      {isClient && (
        <MapContainer
          center={centerPosition}
          zoom={12}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {data.map((row, index) => (
            <Marker
              key={`${row.WGS84_lat}-${row.WGS84_lng}-${index}`}
              position={[row.WGS84_lat, row.WGS84_lng]}
              icon={customIcon} // Benutzerdefiniertes Icon
            >
              <Popup>
                <b>Standort:</b> {row.Standortname}
                <br />
                <b>Temperatur:</b> {row.T} °C
                <br />
                <b>Datum:</b> {new Date(row.Datum).toLocaleDateString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
