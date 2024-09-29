'use client'

import React from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import { FaFilePdf } from 'react-icons/fa';
import { CiVideoOn } from "react-icons/ci";
import Image from 'next/image';

import { customIcon, PropertyInfo } from '@/app/dashboard/(hooks)/types'
import { Button } from "@/components/ui/button"
import { Location } from '@/app/dashboard/(hooks)/types'
import { useState, useEffect } from 'react';
import { Card, CardCarousel } from "@/components/ui/card";
import Modal from '@/app/dashboard/(components)/Modal';
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
    const [files, setFiles] = useState<Array<{ url: string; type: string }>>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{ url: string; type: string } | null>(null);


    useEffect(() => {
        if (propertyInfo) {
            fetchPropertyFiles(propertyInfo.id);
        }
    }, [propertyInfo]);

    const fetchPropertyFiles = async (propertyId: number) => {
        try {
            const response = await fetch(`/api/getImages?id=${propertyId}`);
            const fileUrls = await response.json();
            setFiles(fileUrls.map((url: string) => ({
                url,
                type: url.toLowerCase().endsWith('.pdf') ? 'pdf' :
                    url.toLowerCase().endsWith('.mp4') ? 'video' : 'image'
            })));
        } catch (error) {
            console.error('Error fetching property files:', error);
        }
    };


    if (!propertyInfo) return null;

    const handleFileClick = (file: { url: string; type: string }) => {
        setSelectedFile(file);
        setModalOpen(true);
    };


    return (
        <>
            <Marker position={[propertyInfo.location.lat, propertyInfo.location.lng]} icon={customIcon}>
                <CustomPopup>
                    <Card className="w-96">
                        <CardCarousel
                            images={files}
                            className='h-48'
                            renderItem={(file) => (
                                <div onClick={() => handleFileClick(file)} className="w-full h-full">
                                    {file.type === 'pdf' ? (
                                        <div className="flex flex-col items-center justify-center h-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                                            <FaFilePdf className="text-5xl text-red-500 mb-2" />
                                            <span className="text-sm font-medium text-gray-700">Click to view PDF</span>
                                        </div>
                                    ) : file.type === 'video' ? (
                                        <div className="flex flex-col items-center justify-center h-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                                            <CiVideoOn className="text-5xl text-blue-500 mb-2" />
                                            <span className="text-sm font-medium text-gray-700">Click to play video</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 relative">
                                            <Image
                                                src={file.url}
                                                alt="Property"
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                        />
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

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                {selectedFile && (
                    <div className="max-w-3xl max-h-[90vh] overflow-auto">
                        {selectedFile.type === 'pdf' ? (
                            <embed src={selectedFile.url} type="application/pdf" width="100%" height="600px" />
                        ) : selectedFile.type === 'video' ? (
                            <video controls className="max-w-full max-h-[80vh]">
                                <source src={selectedFile.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <Image
                                src={selectedFile.url}
                                alt="Property"
                                width={800}
                                height={600}
                                style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
                            />
                        )}
                    </div>
                )}
            </Modal>

        </>
    );
}; export { FormMarker, LocationMarker, PropertyMarker };
