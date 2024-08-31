'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Location {
    lng: number;
    lat: number;
}

export interface PropertyInfo {
    address: string;
    status?: string;
    sqm: number;
    priceHistory?: Array<{ price: number }>;
    createdAt: string;
}

const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

interface MapProps {
    location: Location | null;
    propertyInfo: PropertyInfo | null;
}

export default function MapComponent({ location, propertyInfo }: MapProps) {
    return (
        <div style={{ height: '400px', width: '900px' }}>
            <MapContainer
                center={[location?.lat || 0, location?.lng || 0]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {location != null && (
                    <Marker position={[location.lat, location.lng]} icon={customIcon}>
                        <Popup>
                            {propertyInfo ? (
                                <>
                                    <h3>{propertyInfo.address}</h3>
                                    <p>Status: {propertyInfo.status || 'Not Available'}</p>
                                    <p>SQM: {propertyInfo.sqm} m²</p>
                                    <p>Price: {propertyInfo.priceHistory?.[0]?.price || 'Price not available'}</p>
                                    <p>Created At: {new Date(propertyInfo.createdAt).toLocaleString()}</p>
                                </>
                            ) : (
                                'No property selected'
                            )}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
