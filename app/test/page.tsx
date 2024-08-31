'use client'

import axios from 'axios';
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PropertyInfo } from '@/app/test/(components)/MapComponent';

interface Location {
    lng: number;
    lat: number;
}

interface Data {
    id: number;
    location?: Location;
    address: string;
    status?: string;
    sqm: number;
    priceHistory?: null | Array<any>;
    createdAt: string;
    otherAttributes?: null;
}

const MapComponent = dynamic(() => import('@/app/test/(components)/MapComponent'), {
    ssr: false,
});

export default function TestPage() {
    const [data, setData] = useState<Data[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [selectedPropertyLocation, setSelectedPropertyLocation] = useState<Location | null>(null);
    const [selectedPropertyInfo, setSelectedPropertyInfo] = useState<PropertyInfo | null>(null);

    useEffect(() => {
        console.log("TestPage component mounted");
    }, []);

    useEffect(() => {
        console.log("Data state:", data);
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Data[]>('api/getProperties');
                console.log("API Response:", response.data);
                setData(response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // empty dependency array to run the effect only once

    const handleCardClick = (propertyId: number) => {
        const property = data.find(item => item.id === propertyId);
        if (property && property.location) {
            setSelectedPropertyId(propertyId);
            setSelectedPropertyLocation(property.location);

            // Get additional property info
            const propertyInfo = {
                address: property.address,
                status: property.status,
                sqm: property.sqm,
                priceHistory: property.priceHistory ? [{ price: property.priceHistory[0].price }] : undefined,
                createdAt: property.createdAt,
            };
            setSelectedPropertyInfo(() => ({
                ...propertyInfo,
                priceHistory: propertyInfo.priceHistory || []
            }));
        }
    };

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
            <div className="flex flex-row mt-5">
                <div className="flex-grow overflow-y-auto pr-4 max-h-screen">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : data.length > 0 ? (
                        <div className="flex flex-col min-h-[calc(100vh-200px)]">
                            {data.map((item) => (
                                <Card
                                    key={item.id}
                                    className={`mb-4 ${selectedPropertyId === item.id ? 'border border-blue-500' : ''
                                        } hover:shadow-md hover:transition-all hover:duration-300`}
                                    onClick={() => handleCardClick(item.id)}
                                >
                                    <CardContent className="p-6">
                                        <h2 className="text-xl font-semibold mb-2">{item.address}</h2>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center">
                                                <FaMapMarkerAlt className="mr-2 text-red-500" size={18} />
                                                <p className="text-sm text-gray-600">
                                                    {item.location ? `${item.location.lng}, ${item.location.lat}` : 'Location not available'}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-2 text-green-500" size={18} />
                                                <p className="text-sm text-gray-600">Status: {item.status || 'Not Available'}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <p className="text-lg font-medium">${item.priceHistory?.[0]?.price || 'Price not available'}</p>
                                            <p className="text-sm text-gray-500">{item.sqm} m²</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p>No data available.</p>
                    )}
                </div>

                <Suspense fallback={<div>Loading map...</div>}>
                    <MapComponent location={selectedPropertyLocation} propertyInfo={selectedPropertyInfo} />
                </Suspense>
            </div>
        </div>
    );
}
