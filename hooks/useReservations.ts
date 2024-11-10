'use client'

import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PropertyInfo, Reservations } from './types';

export const useReservations = () => {
    const fetchPropertiesAndReservations = async () => {
        const propertiesResponse = await axios.get<PropertyInfo[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`);
        const reservationsResponse = await axios.get<Reservations[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations`);

        //Append reservations to properties
        const result = reservationsResponse.data.map((reservations) => ({
            ...reservations,
            propertyInfo: propertiesResponse.data.filter((property) => property.id === reservations.propertyId),
        }));
        console.log(result)

        return result;
    };

    const createReservation = async ({ propertyId, userId, reservationDate }: { propertyId: number, userId: number, reservationDate: string }) => {
        const isoDate = new Date(reservationDate).toISOString();
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations`, {
            propertyId,
            userId,
            reservationDate: isoDate,
        });
        return response.data;
    };

    const deleteReservation = async (id: number) => {
        console.log(id);
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/${id}`);
    };

    const queryKey = ['properties', 'reservations'];

    const { data: properties, isLoading, isError } = useQuery({
        queryKey,
        queryFn: fetchPropertiesAndReservations,
    });

    const mutation = useMutation({
        mutationFn: createReservation,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteReservation(id),
    });

    return { properties, isLoading, isError, mutation, deleteMutation };
};
