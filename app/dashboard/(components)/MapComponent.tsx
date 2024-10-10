'use client'

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AdditionalPropertiesModal from '@/app/dashboard/(components)/additionalPropForm';
import AddFormModal from './addForm';
import { Location, PropertyInfo, customIcon } from '@/app/dashboard/(hooks)/types';
import { FormMarker, LocationMarker, PropertyMarker } from '@/app/dashboard/(components)/formMarker';
import { SearchControl } from './SearchControl';
import { Search, X } from 'lucide-react';
import '@/app/dashboard/(components)/modal.css';

interface MapProps {
    location: Location | null;
    propertyInfo: PropertyInfo | null;
}

const RecenterAutomatically = ({ lat, lng }: Location) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], 16);
    }, [lat, lng, map]);
    return null;
};

export default function MapComponent({ location, propertyInfo }: MapProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [marker, setMarker] = useState<Location | null>(null);
    const [isSearchVisible, setIsSearchVisible] = useState(true);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

    const handleOpenView = () => {
        setIsModalOpen(true);
    };
    const handleOpenForm = () => {
        setIsFormOpen(true);
    };
    const addMarker = (position: Location) => {
        setMarker(position);
    };

    const handleSearchResult = useCallback((result: any) => {
        const { x, y, label } = result;
        const newLocation: Location = { lng: x, lat: y, name: label };
        setMarker(newLocation);
        setMapCenter([y, x]);
    }, []);

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    useEffect(() => {
        if (!isFormOpen) {
            setMarker(null);
        }
    }, [isFormOpen]);

    return (
        <div className="relative w-full h-full">
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
                {mapCenter && <RecenterAutomatically lat={mapCenter[0]} lng={mapCenter[1]} />}
                {isSearchVisible && <SearchControl onSearchResult={handleSearchResult} />}
            </MapContainer>
            <div className="absolute top-4 right-4 z-[1000] flex items-center">
                <button
                    onClick={toggleSearch}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                    {isSearchVisible ? <X size={24} /> : <Search size={24} />}
                </button>
            </div>
            <AdditionalPropertiesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} propertyInfo={propertyInfo} />
            <AddFormModal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setMarker(null); }} location={marker || { lat: 0, lng: 0 }} />
        </div>
    );
}