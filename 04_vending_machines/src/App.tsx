import { Marker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import './App.css';

function App() {
  const coords: [number, number] = [35.5099291,139.6146256];

  // Thanks Stack Overflow https://stackoverflow.com/a/15092318
  function MapInitializer() {
    const map = useMap();
    map.invalidateSize();
    return null;
  }

  return (
    <>
      <img height='200px' src='/icon.png' />
      <h1>vending machines</h1>
      <MapContainer center={coords} zoom={13}>
        <MapInitializer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={coords}>
          <Popup>
            Shin-Yokohama Ramen Museum
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
}

export default App
