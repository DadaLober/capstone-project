'use client'

import React from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import { customIcon, PropertyInfo } from '@/app/dashboard/(hooks)/types'
import { Button } from "@/components/ui/button"
import { Location } from '@/app/dashboard/(hooks)/types'
import { useState, useEffect } from 'react';
import { Card, CardCarousel } from "@/components/ui/card";
import "@/app/dashboard/(components)/modal.css"

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
            <div className="leaflet-popup-content-wrapper" style={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                border: 'none',
                borderRadius: '0',
                padding: '0',
                margin: '0'
            }}>
                <div className="leaflet-popup-content" style={{
                    margin: '10000000',
                    padding: '0',
                    width: 'auto',
                }}>
                    {children}
                </div>
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
            <CustomPopup className="bg-white rounded-lg w-64 flex flex-col items-center justify-center text-center">
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
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        if (propertyInfo) {
            fetchPropertyImages(propertyInfo.id);
        }
    }, [propertyInfo]);

    const fetchPropertyImages = async (propertyId: number) => {
        try {
            const response = await fetch(`/api/getImages?id=${propertyId}`);
            const imageUrls = await response.json();
            setImages(imageUrls);
        } catch (error) {
            console.error('Error fetching property images:', error);
        }
    };

    if (!propertyInfo) return null;

    return (
        <Marker position={[propertyInfo.location.lat, propertyInfo.location.lng]} icon={customIcon}>
            <CustomPopup>
                <Card className="w-96">
                    <CardCarousel images={images} className='h-48' />
                    <div className="p-4">
                        <h3 className="text-xl font-bold mb-4 text-blue-600">{propertyInfo.address}</h3>
                        <div className="flex flex-col space-y-4">
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
                                View More
                            </Button>
                        </div>
                    </div>
                </Card>
            </CustomPopup>
        </Marker>
    );
};
export { FormMarker, LocationMarker, PropertyMarker };
