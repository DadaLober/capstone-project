"use client";

import React, { useCallback, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { PropertyInfo } from '@/app/dashboard/(hooks)/types';
import { useGeocode } from '../(hooks)/useGeocode';
import { useProperties } from '../(hooks)/useProperties';
import useLocation from '../(hooks)/useLocation';
import LocationInputs from './locationInputs';
import AddressInput from './addressInput';
import SquareMetersInput from './squareMetersInput';
import PriceInput from './priceInput';
import { isAxiosError } from 'axios';
import Modal from './Modal';

interface UpdatePropertyModalProps {
    isOpen: boolean;
    property: PropertyInfo | null;
    onClose: () => void;
}

function UpdatePropertyModal({ isOpen, onClose, property }: UpdatePropertyModalProps) {
    const queryClient = useQueryClient();
    const geocode = useGeocode;
    const { editMutation: editProperty } = useProperties();
    const currentLocation = useLocation(property?.location || { lat: 0, lng: 0 });
    const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<PropertyInfo>({
        defaultValues: {
            createdAt: new Date().toISOString(),
            otherAttributes: { "hello": "world" },
        }
    });
    const { remove } = useFieldArray({
        control,
        name: 'priceHistory'
    });

    const onSubmit = async (data: PropertyInfo) => {
        if (!property) {
            return;
        }

        const newData = {
            createdAt: property.createdAt || new Date().toISOString(),
            otherAttributes: { "hello": "world" },
            address: data.address,
            sqm: Number(data.sqm),
            price: Number(data.priceHistory?.[0]?.price) || 0,
            location: currentLocation,
            id: property.id
        };

        console.log(newData);
        const serializedData = JSON.stringify(newData);
        try {
            await editProperty.mutateAsync(JSON.parse(serializedData));
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            onClose();
        } catch (error: any) {
            if (isAxiosError(error)) {
                console.error(error.response?.data);
            }
        }
    };

    const setPropertyValues = useCallback(() => {
        if (!property) {
            return;
        }
        setValue('address', property.address);
        setValue('sqm', property.sqm);
    }, [property, setValue]);


    const generateAddress = async () => {
        if (currentLocation.lat && currentLocation.lng) {
            try {
                const result = await geocode(currentLocation.lat, currentLocation.lng);
                console.log(result);
                if (result) {
                    setValue('address', result.display_name);
                }
            } catch (error) {
                console.error('Error generating address:', error);
            }
        }
    };

    const handleClose = () => {
        reset();
        remove();
        onClose();
    };

    useEffect(() => {
        if (isOpen && property) {
            reset();
            setPropertyValues();
        }
    }, [isOpen, property, reset, setPropertyValues]);

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="bg-white p-4 w-auto rounded-lg shadow-lg max-w-2xl mx-auto">
                <h2 className="text-lg font-bold mb-4">Update Property</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                    <LocationInputs currentLocation={currentLocation} />
                    <AddressInput register={register} errors={errors} generateAddress={generateAddress} />
                    <SquareMetersInput register={register} errors={errors} />
                    <PriceInput register={register} errors={errors} />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </form>
            </div>
        </Modal >
    );
}

export default UpdatePropertyModal;
