import { ReactNode, useState } from 'react';
import { Marker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import { Map } from 'leaflet';
import VMCard from './VMCard';
import './App.css';

function App() {
  const [leaflet, setLeaflet] = useState<Map>();
  const coords: [number, number] = [35.5099291,139.6146256];

  const vendingMachines: VendingMachine[] = [
    {
      coords: [35.5099291, 139.6146256],
      imageSrc: '/PXL_20231127_085359314.jpeg',
      notes:
        'A vending machine in the basement floor of the Shin-Yokohama Ramen Museum',
      locationText: 'Shin-Yokohama Ramen Museum',
    },
    {
      coords: [35.509985, 139.6147386],
      imageSrc: '/PXL_20231127_082330310.jpeg',
      notes:
        'Right outside the Shin-Yokohama Ramen Museum',
      locationText: 'Near Shin-Yokohama Ramen Museum',
    },
    {
      coords: [35.441439, 139.639825], // TODO: Fix this location
      imageSrc: '/PXL_20231127_033605556.jpeg',
      notes:
        'Cool dragons',
      locationText: 'Yokohama Chinatown',
    },
  ];

  function Markers(): ReactNode {
    return vendingMachines.map((vm) => {
      return (
        <Marker position={vm.coords}>
          <Popup>{vm.locationText}</Popup>
        </Marker>
      )
    });
  }

  function VMCards(): ReactNode {
    return vendingMachines.map((vm) => {
      return (
        <VMCard
          vendingMachine={vm}
          goTo={() => {
            if (leaflet) {
              leaflet.flyTo(vm.coords);
            }
          }}
        />
      )
    });
  }

  // Thanks Stack Overflow https://stackoverflow.com/a/15092318
  function MapInitializer() {
    const map = useMap();
    setLeaflet(map);
    map.invalidateSize();
    return null;
  }

  return (
    <>
      <div className='header'>
        <img height='150px' src='/icon.png' />
        <h1>vending machines</h1>
      </div>
      <div className='container'>
        <div className='sidebar'>
          <VMCards />
        </div>
        <MapContainer center={coords} zoom={13}>
          <MapInitializer />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <Markers />
        </MapContainer>
      </div>
    </>
  );
}

export default App
