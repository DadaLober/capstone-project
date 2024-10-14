import { useState, useEffect, useCallback } from 'react';
import { PropertyInfo, Reservations } from '@/hooks/types';
import axios from 'axios';

export const useProperties = () => {
    const [properties, setProperties] = useState<PropertyInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const fetchProperties = useCallback(async () => {
        try {
            const propertiesResponse = await axios.get<PropertyInfo[]>('http://localhost:3000/api/getProperties');
            const reservationsResponse = await axios.get<Reservations[]>('http://localhost:3000/api/getReservations');

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
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching properties:', error);
            setIsError(true);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    return { properties, isLoading, isError };
};