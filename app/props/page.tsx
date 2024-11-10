"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { PropertyInfo, Reservations } from '../../hooks/types';
import axios from 'axios';

const PropertyListing: React.FC = () => {
    const [properties, setProperties] = useState<PropertyInfo[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const propertiesResponse = await axios.get<PropertyInfo[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`);
            const reservationsResponse = await axios.get<Reservations[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations`);

            if (propertiesResponse.status !== 200 || reservationsResponse.status !== 200) {
                throw new Error('Failed to fetch data');
            }

            const propertiesData: PropertyInfo[] = propertiesResponse.data;
            const reservationsData: Reservations[] = reservationsResponse.data;

            // Create a map of propertyId to its latest active reservation status
            const reservationStatusMap = new Map<number, string>();
            reservationsData.forEach(reservation => {
                const propertyId = reservation.propertyId;
                const status = reservation.status.toLowerCase();
                if (status === 'active' || !reservationStatusMap.has(propertyId)) {
                    reservationStatusMap.set(propertyId, status);
                }
            });

            // Update properties with reservation status
            const updatedProperties = propertiesData.map(property => {
                const reservationStatus = reservationStatusMap.get(property.id);
                let newStatus = property.status?.toLowerCase() ?? '';

                if (reservationStatus === 'active') {
                    newStatus = 'reserved';
                } else if (reservationStatus === 'sold') {
                    newStatus = 'sold';
                } else if (!['sold', 'cancelled', 'canceled', 'expired'].includes(newStatus)) {
                    newStatus = 'active';
                }

                return { ...property, status: newStatus };
            });

            setProperties(updatedProperties);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please try again later.');
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'reserved':
                return 'text-yellow-600';
            case 'active':
                return 'text-green-600';
            case 'sold':
                return 'text-red-600';
            case 'cancelled':
            case 'canceled':
                return 'text-gray-600';
            case 'expired':
                return 'text-orange-600';
            default:
                return 'text-blue-600';
        }
    };

    if (error) {
        return <div className="text-red-600 text-center mt-8">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Property Listings</h1>
            {properties.length === 0 ? (
                <p className="text-center">Loading properties...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map(property => (
                        <div key={property.id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-2">{property.address}</h2>
                            <p className="text-gray-600 mb-2">Size: {property.sqm} sqm</p>
                            <p className="text-gray-600 mb-2">
                                Location: {property.location.name || `${property.location.lat.toFixed(6)}, ${property.location.lng.toFixed(6)}`}
                            </p>
                            <p className={`font-bold ${getStatusColor(property.status || '')}`}>
                                Status: {property.status || 'Unknown'}
                            </p>
                            {property.priceHistory && property.priceHistory.length > 0 && (
                                <p className="text-gray-600 mt-2">
                                    Current Price: ₱{property.priceHistory[property.priceHistory.length - 1].price.toFixed(2)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PropertyListing;