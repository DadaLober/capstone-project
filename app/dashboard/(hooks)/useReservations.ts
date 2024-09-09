'use client'

import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PropertyInfo, Reservations } from './types';

interface reservationType extends PropertyInfo {
    reservations?: Reservations[];
}

export const useReservations = () => {
    const fetchPropertiesAndReservations = async (): Promise<(reservationType)[]> => {
        const propertiesResponse = await axios.get<PropertyInfo[]>('http://localhost:3000/api/getProperties');
        const reservationsResponse = await axios.get<Reservations[]>('http://localhost:3000/api/getReservations');

        //Append reservations to properties
        const result = reservationsResponse.data.map((reservations) => ({
            ...reservations,
            propertyInfo: propertiesResponse.data.filter((property) => property.id === reservations.propertyId) as Reservations[],
        }));

        console.log(result);
        return result;
    };

    const deleteProperty = async (id: number): Promise<void> => {
        await axios.delete(`api/deleteProperty`, {
            params: {
                id: id,
            }
        });
    };

    const queryKey = ['properties', 'reservations'];

    const { data: properties, isLoading, isError } = useQuery({
        queryKey,
        queryFn: fetchPropertiesAndReservations,
    });

    const mutation = useMutation({
        mutationFn: (id: number) => deleteProperty(id),
    });

    return { properties, isLoading, isError, mutation };
};
