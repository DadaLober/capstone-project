'use client'

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AdditionalPropertiesModal from '@/app/dashboard/(components)/AdditionalPropertiesModal';
import AddFormModal from './addFormModal';
import { Location, PropertyInfo, customIcon } from '@/app/dashboard/(hooks)/types';
import { FormMarker, LocationMarker, PropertyMarker } from '@/app/dashboard/(components)/formMarker';
import '@/app/dashboard/(components)/modal.css';

interface MapProps {
    location: Location | null;
    propertyInfo: PropertyInfo | null;
}

const RecenterAutomatically = ({ lat, lng }: Location) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], 16);
    }, [lat, lng]);
    return null;
};

export default function MapComponent({ location, propertyInfo }: MapProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [marker, setMarker] = useState<Location | null>(null);

    const handleOpenView = () => {
        setIsModalOpen(true);
    };
    const handleOpenForm = () => {
        setIsFormOpen(true);
    };
    const addMarker = (position: Location) => {
        setMarker(position);
    };

    useEffect(() => {
        if (!isFormOpen) {
            setMarker(null);
        }
    }, [isFormOpen]);

    return (
        <div className="relative w-full h-[100vh] mr-4">
            <MapContainer
                center={[location?.lat || 0, location?.lng || 0]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                doubleClickZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <LocationMarker addMarker={addMarker} />
                {marker && (
                    <>
                        <Marker position={[marker.lat, marker.lng]} icon={customIcon} />
                        <FormMarker location={marker} handleOpenForm={handleOpenForm} />
                    </>
                )}
                {location != null && (
                    <>
                        <RecenterAutomatically lat={location.lat} lng={location.lng} />
                        <PropertyMarker propertyInfo={propertyInfo} handleViewAdditionalProperties={handleOpenView} />
                    </>
                )}
            </MapContainer>
            <AdditionalPropertiesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} propertyInfo={propertyInfo} />
            <AddFormModal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false), setMarker(null) }} location={marker || { lat: 0, lng: 0 }} />
        </div>
    );
}
