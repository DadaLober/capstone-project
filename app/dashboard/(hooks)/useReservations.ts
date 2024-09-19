'use client'

import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PropertyInfo, Reservations } from './types';

export const useReservations = () => {
    const fetchPropertiesAndReservations = async () => {
        const propertiesResponse = await axios.get<PropertyInfo[]>('http://localhost:3000/api/getProperties');
        const reservationsResponse = await axios.get<Reservations[]>('http://localhost:3000/api/getReservations');

        //Append reservations to properties
        const result = reservationsResponse.data.map((reservations) => ({
            ...reservations,
            propertyInfo: propertiesResponse.data.filter((property) => property.id === reservations.propertyId),
        }));

        return result;
    };

    const createReservation = async (id: number) => {
        console.log(id);
        await axios.post('api/addToReserved', {
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
        mutationFn: (id: number) => createReservation(id),
    });

    return { properties, isLoading, isError, mutation };
};
