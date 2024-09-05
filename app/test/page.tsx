'use client'

import axios from 'axios';
import dynamic from 'next/dynamic';
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import type { PropertyInfo, Location } from '@/app/test/(components)/types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";


const MapComponent = dynamic(() => import('@/app/test/(components)/MapComponent'), {
    ssr: false,
});

function TestPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [selectedPropertyLocation, setSelectedPropertyLocation] = useState<Location | null>(null);
    const [selectedPropertyInfo, setSelectedPropertyInfo] = useState<PropertyInfo | null>(null);
    const [data, setData] = useState<PropertyInfo[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get<PropertyInfo[]>('api/getProperties');
            setData(response.data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (propertyId: number) => {
        const property = data.find(item => item.id === propertyId);
        if (property && property.location) {
            setSelectedPropertyId(propertyId);
            setSelectedPropertyLocation(property.location);
            setSelectedPropertyInfo(getPropertyInfo(property));
        } else {
            console.warn(`Property not found with ID: ${propertyId}`);
        }
    };


    const getPropertyInfo = (property: PropertyInfo) => ({
        id: property.id,
        location: {
            lng: property.location?.lng || 0,
            lat: property.location?.lat || 0,
        },
        address: property.address,
        status: property.status || 'Not Available',
        sqm: property.sqm,
        priceHistory: property.priceHistory?.map(priceHistoryItem => ({
            date: new Date().toISOString(),
            price: priceHistoryItem.price,
        })),
        createdAt: property.createdAt,
        otherAttributes: property.otherAttributes || {},
    });

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink>Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>Components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-col md:flex-row mt-5 gap-4 cool-scrollbar ">
                <div className="flex-grow overflow-y-auto pr-4 max-h-screen">
                    {loading && <p>Loading....</p>}
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && data.length > 0 && (
                        <div className="flex flex-col ">
                            {data.map((item) => (
                                <Card
                                    key={item.id}
                                    className={`mb-4 ${selectedPropertyId === item.id ? 'border border-blue-500' : ''} hover:shadow-md transition-all duration-300`}
                                    onClick={() => handleCardClick(item.id)}
                                >
                                    <CardContent className="p-4">
                                        <h2 className="text-base font-semibold mb-2">{item.address}</h2>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center">
                                                <FaMapMarkerAlt className="mr-2 text-red-500" size={14} />
                                                <p className="text-xs text-gray-600">
                                                    {item.location ? `${item.location.lng}, ${item.location.lat}` : 'Location not available'}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-2 text-green-500" size={14} />
                                                <p className="text-xs text-gray-600">Status: {item.status || 'Not Available'}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end mb-2">
                                            <p className="text-base font-medium">${item.priceHistory?.[0]?.price || 'Price not available'}</p>
                                            <p className="text-xs text-gray-500">{item.sqm} m²</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                    {!loading && !error && data.length === 0 && <p>No data available.</p>}
                </div>

                <Suspense fallback={<div>Loading map...</div>}>
                    <MapComponent location={selectedPropertyLocation} propertyInfo={selectedPropertyInfo} />
                </Suspense>
            </div>
        </div>
    );
}

export default TestPage;
