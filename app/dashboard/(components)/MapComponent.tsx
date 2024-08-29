import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import FormComp from './FormComp';
import PropertyCard from './PropertyCard';
import { propertyData, PropertyData } from './PropertyData';
import Header from './Header';

interface MapProps {
  center: [number, number];
  zoom: number;
}
interface MarkerPosition {
  lat: number;
  lng: number;
  name: string;
}
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
const LocationMarker: React.FC<{
  addMarker: (position: { lat: number; lng: number }) => void;
}> = ({ addMarker }) => {
  useMapEvents({
    click(e) {
      const newPosition = e.latlng;
      addMarker(newPosition);
    },
  });

  return null;
};

const MapComponent: React.FC<MapProps> = ({ center, zoom }) => {
  const [marker, setMarker] = useState<MarkerPosition | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('');

  const addMarker = (position: { lat: number; lng: number }) => {
    setSelectedPosition(position);
    setMarker({ ...position, name: locationName || 'Unnamed Location' });
  };
  useEffect(() => {
    if (marker) {
      setMarker((prevMarker) =>
        prevMarker ? { ...prevMarker, name: locationName || 'Unnamed Location' } : null
      );
    }
  }, [locationName]);

  const updateMarkerPosition = (e: L.LeafletEvent) => {
    const newPosition = e.target.getLatLng();
    setMarker((prevMarker) =>
      prevMarker
        ? { ...prevMarker, lat: newPosition.lat, lng: newPosition.lng }
        : null
    );
    setSelectedPosition(newPosition);
  };

  return (
    <div className='w-full h-full'>
    <div className="relative z-10">
      <div className='absolute top-0 left-0'>
          <FormComp
            selectedPosition={selectedPosition}
            address={locationName}
            setAddress={setLocationName}
          /> 
      </div>
    </div>
    <div className='w-full'>
      <Header/>
    </div>
      <div className="relative  rounded w-full h-full flex  gap-5">
        
        <div className='w-auto'>
          <div>
            <PropertyCard data= {propertyData}/>
          </div>
        </div>
        {/*Side bar*/}
        
        {/* Map container */}
        <div className="w-full h-full z-0 shadow-lg border ">
          <MapContainer style={{ height: '100%', width: '100%' }} center={center} zoom={zoom} scrollWheelZoom={true}>
            <TileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker addMarker={addMarker} />
            {marker && (
              <Marker
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={customIcon}
                draggable={true}
                eventHandlers={{
                  dragend: updateMarkerPosition,
                }}
              >
                <Popup>
                  <strong>{marker.name}</strong> <br />
                  Latitude: {marker.lat.toFixed(5)} <br />
                  Longitude: {marker.lng.toFixed(5)}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        
      </div>
      
    </div>
  );
};

export default MapComponent;
