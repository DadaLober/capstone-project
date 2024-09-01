'use client'

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from "@/components/ui/button"
import AdditionalPropertiesModal from './AdditionalPropertiesModal';

interface Location {
    lng: number;
    lat: number;
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

interface MapProps {
    location: Location | null;
    propertyInfo: PropertyInfo | null;
    onInit?: () => void;
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

export default function MapComponent({ location, propertyInfo }: MapProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewAdditionalProperties = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
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
            </MapContainer>
            <AdditionalPropertiesModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                propertyInfo={propertyInfo}
            />
        </div>
    );
}