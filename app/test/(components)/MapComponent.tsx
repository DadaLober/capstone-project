'use client'

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from "@/components/ui/button"
import AdditionalPropertiesModal from './AdditionalPropertiesModal';


interface Location {
    lng: number;
    lat: number;
    name?: string;
}

interface MapProps {
    location: Location | null;
    propertyInfo: PropertyInfo | null;
    onInit?: () => void;
}

export interface PropertyInfo {
    id: number;
    location?: Location;
    address: string;
    status?: string;
    sqm: number;
    priceHistory?: Array<{ price: number }>;
    createdAt: string;
    otherAttributes?: {
        [key: string]: string;
    };
}

const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const RecenterAutomatically = ({ lat, lng }: Location) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
};

const LocationMarker: React.FC<{ addMarker: (position: { lat: number; lng: number }) => void; }> = ({ addMarker }) => {
    useMapEvents({
        click(e) {
            const newPosition = e.latlng;
            addMarker(newPosition);
        },
    });
    return null;
};


export default function MapComponent({ location, propertyInfo }: MapProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [marker, setMarker] = useState<Location | null>(null);
    const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);

    const handleViewAdditionalProperties = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const addMarker = (position: { lat: number; lng: number }) => {
        setSelectedPosition(position);
        setMarker({ ...position });
    };

    useEffect(() => {
        if (marker) {
            setMarker((prevMarker) =>
                prevMarker ? { ...prevMarker } : null
            );
        }
    });
    const updateMarkerPosition: (e: L.LeafletEvent) => void = (e) => {
        const newPosition = e.target.getLatLng();
        setMarker((prevMarker) =>
            prevMarker
                ? { ...prevMarker, lat: newPosition.lat, lng: newPosition.lng }
                : null
        );
        setSelectedPosition(newPosition);
    };

    
    return (
        <div className="relative w-full h-[700px]">
            <MapContainer
                center={[location?.lat || 0, location?.lng || 0]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    maxZoom={20}
                    attribution='&copy; <a href="https://www.google.com/maps/">Google Maps</a>'
                />
                <LocationMarker addMarker={addMarker} />
                {location != null && (
                    <>
                        <Marker position={[location.lat, location.lng]} icon={customIcon}>
                            <Popup className="bg-white rounded-lg shadow-lg p-4 w-96 flex flex-col items-stretch">
                                {propertyInfo ? (
                                    <>
                                        <h3 className="text-xl font-bold mb-4 text-blue-600">{propertyInfo.address}</h3>
                                        <div className="flex flex-col space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold">Status:</span>
                                                <span>{propertyInfo.status || 'Not Available'}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold">Sqm:</span>
                                                <span>{propertyInfo.sqm} m²</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold">Price:</span>
                                                <span>{propertyInfo.priceHistory?.[0]?.price || 'Price not available'}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold">Created At:</span>
                                                <span>{new Date(propertyInfo.createdAt).toLocaleString()}</span>
                                            </div>
                                            <Button
                                                variant="default"
                                                className="mt-4"
                                                onClick={handleViewAdditionalProperties}
                                            >
                                                View Additional Properties
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    'No property selected'
                                )}
                            </Popup>
                        </Marker>
                        <RecenterAutomatically lat={location.lat} lng={location.lng} />
                    </>
                )}
                {marker && (
                    <Marker
                        position={{ lat: marker.lat, lng: marker.lng }}
                        icon={customIcon}
                        draggable={true}
                        eventHandlers={{
                            dragend: updateMarkerPosition,
                        }}
                    >
                        <Popup className="bg-white rounded-lg shadow-md p-4 w-64 flex flex-col items-center justify-center text-center">
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">{marker.name || 'Unnamed Location'}</h3>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Latitude: {marker.lat}</p>
                                <p className="text-sm text-gray-500">Longitude: {marker.lng}</p>
                            </div>
                            <div className="text-center">
                                <Button
                                    variant="default"
                                    className="mt-4 w-full"
                                    onClick={() => console.log('Marker details viewed')}
                                >
                                    Add Property
                                </Button>
                            </div>
                        </Popup>
                    </Marker>
                )}

            </MapContainer>
            <AdditionalPropertiesModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                propertyInfo={propertyInfo}
            />
        </div>
    );
}