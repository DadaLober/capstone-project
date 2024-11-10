'use client'

import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PropertyInfo } from './types';

export const useProperties = () => {
    const queryClient = useQueryClient();

    const fetchProperties = async (): Promise<PropertyInfo[]> => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`);
        return response.data;
    };

    const deleteProperty = async (id: number): Promise<void> => {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`);
    };

    const editProperty = async (property: PropertyInfo): Promise<PropertyInfo> => {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${property.id}`, property);
        return response.data;
    };

    const queryKey = ['properties'];

    const { data: properties, isLoading, isError } = useQuery({
        queryKey,
        queryFn: fetchProperties,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProperty,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const editMutation = useMutation({
        mutationFn: editProperty,
        onMutate: async (updatedProperty) => {

            await queryClient.cancelQueries({ queryKey });
            const previousProperties = queryClient.getQueryData<PropertyInfo[]>(queryKey);

            if (previousProperties) {
                queryClient.setQueryData<PropertyInfo[]>(queryKey, old =>
                    old?.map(property =>
                        property.id === updatedProperty.id ? { ...property, ...updatedProperty } : property
                    )
                );
            }
            return { previousProperties };
        },
        onError: (err, newProperty, context) => {
            if (context?.previousProperties) {
                queryClient.setQueryData<PropertyInfo[]>(queryKey, context.previousProperties);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return { properties, isLoading, isError, deleteMutation, editMutation };
};