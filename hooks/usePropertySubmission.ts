import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PropertyInfo } from './types';

export const usePropertySubmission = () => {
    const queryClient = useQueryClient();

    const submitProperty = async (data: PropertyInfo) => {
        console.log('Submitting property:', data);
        const response = await axios.post('/api/properties', data);
        return response.data;
    };

    const uploadFiles = async (propertyId: number, files: File[]) => {
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            await axios.post(`/api/properties/${propertyId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }
    };

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ data, files }: { data: PropertyInfo; files: File[] }) => {
            const newProperty = await submitProperty(data);
            console.log('New property:', newProperty);
            console.log('New property ID:', newProperty.id);
            await uploadFiles(newProperty.id, files);
            return newProperty;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
        },
    });

    return { mutate, isPending };
};
