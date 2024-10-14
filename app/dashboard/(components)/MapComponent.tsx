'use client'

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AdditionalPropertiesModal from '@/app/dashboard/(components)/additionalPropForm';
import AddFormModal from './addForm';
import { Location, PropertyInfo, customIcon } from '@/hooks/types';
import { FormMarker, LocationMarker, PropertyMarker } from '@/app/dashboard/(components)/formMarker';
import { SearchControl } from './SearchControl';
import { Search, X } from 'lucide-react';
import '@/app/dashboard/(components)/modal.css';
import { useUserInfo } from '@/hooks/useUserInfo';

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
    const { userInfo } = useUserInfo();

    const handleOpenView = () => {
        setIsModalOpen(true);
    };
    const handleOpenForm = () => {
        setIsFormOpen(true);
    };
    const addMarker = (position: Location) => {
        if (userInfo?.role === 'broker') {
            setMarker(position);
        }
    };

    const handleSearchResult = useCallback((result: any) => {
        const { x, y, label } = result;
        const newLocation: Location = { lng: x, lat: y, name: label };
        if (userInfo?.role === 'broker') {
            setMarker(newLocation);
        }
        setMapCenter([y, x]);
    }, [userInfo]);

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
                {userInfo?.role === 'broker' && <LocationMarker addMarker={addMarker} />}
                {marker && userInfo?.role === 'broker' && (
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
            <div className="absolute top-4 right-4 z-[600] flex items-center">
                <button
                    onClick={toggleSearch}
                    className="bg-gray-400 p-2 rounded-full shadow-md hover:bg-gray-500 transition-colors"
                >
                    {isSearchVisible ? <X size={24} /> : <Search size={24} />}
                </button>
            </div>
            <AdditionalPropertiesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} propertyInfo={propertyInfo} />
            <AddFormModal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setMarker(null); }} location={marker || { lat: 0, lng: 0 }} />
        </div>
    );
}