import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamischer Import, um SSR zu deaktivieren
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

const Map = ({ data, selectedStation }) => {
  return (
    <MapContainer
      center={[47.3769, 8.5417]} // Standardposition Zürich
      zoom={12}
      className="leaflet-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data
        .filter(
          (row) => row.WGS84_lat !== undefined && row.WGS84_lng !== undefined
        )
        .map((row, index) => (
          <Marker key={index} position={[row.WGS84_lat, row.WGS84_lng]}>
            <Popup>
              <b>Standort:</b> {row.Standortname}
              <br />
              <b>Temperatur:</b> {row.T} °C
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default Map;
