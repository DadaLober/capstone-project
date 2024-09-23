'use client'

import React from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import { customIcon, PropertyInfo } from '@/app/dashboard/(hooks)/types'
import { Button } from "@/components/ui/button"
import { Location } from '@/app/dashboard/(hooks)/types'

interface FormMarkerProps {
    location: Location
    handleOpenForm: () => void
}

interface LocationMarkerProps {
    addMarker: (position: Location) => void;
}

interface PropertyMarkerProps {
    propertyInfo: PropertyInfo | null;
    handleViewAdditionalProperties: () => void;
}


interface CustomPopupProps {
    children: React.ReactNode;
    className?: string;
}

const CustomPopup: React.FC<CustomPopupProps> = ({ children }) => {
    return (
        <Popup>
            <div style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', borderRadius: '0', padding: '0' }}>
                {children}
            </div>
        </Popup>
    );
};

const FormMarker: React.FC<FormMarkerProps> = ({ location, handleOpenForm }) => {
    return (
        <Marker
            position={location}
            icon={customIcon}
        >
            <CustomPopup className="bg-white rounded-lg shadow-md p-4 w-64 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{location.name || 'Unnamed Location'}</h3>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Latitude: {location.lat}</p>
                    <p className="text-sm text-gray-500">Longitude: {location.lng}</p>
                </div>
                <div className="text-center">
                    <Button
                        variant="default"
                        className="mt-4 w-full"
                        onClick={handleOpenForm}
                    >
                        Add Property
                    </Button>
                </div>
            </CustomPopup>
        </Marker>
    )
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ addMarker }) => {
    useMapEvents({
        click(e) {
            const newPosition = e.latlng;
            addMarker(newPosition);
        },
    });
    return null;
};

const PropertyMarker: React.FC<PropertyMarkerProps> = ({ propertyInfo, handleViewAdditionalProperties }) => {
    if (!propertyInfo) return null;

    return (
        <Marker position={[propertyInfo.location.lat, propertyInfo.location.lng]} icon={customIcon}>
            <Popup className="bg-white rounded-lg shadow-lg p-4 w-96 flex flex-col items-stretch">
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
            </Popup>
        </Marker>
    );
};
export { FormMarker, LocationMarker, PropertyMarker };
