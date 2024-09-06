'use client'

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AdditionalPropertiesModal from '@/app/test/(components)/additionalPropertiesModal';
import AddFormModal from '@/app/test/(components)/addFormModal';
import { Location, PropertyInfo, customIcon } from '@/app/test/(hooks)/types';
import { FormMarker, LocationMarker, PropertyMarker } from '@/app/test/(components)/formMarker';
import '@/app/test/(components)/modal.css';

interface MapProps {
    location: Location | null;
    propertyInfo: PropertyInfo | null;
}

const RecenterAutomatically = ({ lat, lng }: Location) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], 19);
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

    const handleCloseView = () => {
        setIsModalOpen(false);
    };

    const addMarker = (position: Location) => {
        setMarker(position);
    };

    const handleOpenForm = () => {
        setIsFormOpen(true);
    };
    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    return (
        <div className="relative w-full h-[calc(100vh-64px)]">
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
            <AdditionalPropertiesModal isOpen={isModalOpen} onClose={handleCloseView} propertyInfo={propertyInfo} />
            <AddFormModal isOpen={isFormOpen} onClose={handleCloseForm} location={marker || { lat: 0, lng: 0 }} />
        </div>
    );
}
