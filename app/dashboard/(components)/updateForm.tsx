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
import PriceHistoryInputs from './priceHistoryInputs';
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
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'priceHistory'
    });

    const onSubmit = async (data: PropertyInfo) => {
        console.log(`Data:`, data);
        if (!property) {
            return;
        }
        const newData = { ...data, location: currentLocation, sqm: Number(data.sqm), id: property.id };
        // Convert price to number and remove empty items
        if (newData.priceHistory) {
            newData.priceHistory = newData.priceHistory.filter(item => {
                if (item.price && typeof item.price === 'string') {
                    const priceNum = Number(item.price);
                    if (!isNaN(priceNum)) {
                        item.price = priceNum;
                    }
                    item.time = new Date(item.time).toISOString();
                    return true;
                }
                return false;
            }).filter(Boolean);
        }
        console.log(newData);
        try {
            await editProperty.mutateAsync(newData);
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            return;
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
        property.priceHistory?.forEach((priceItem, index) => {
            const isoString = priceItem.time;
            const [date, time] = isoString.split('T');
            const [year, month, day] = date.split('-');
            const [hours, minutes] = time.split(':');
            setValue(`priceHistory.${index}.price`, priceItem.price);
            setValue(`priceHistory.${index}.time`, `${year}-${month}-${day}T${hours}:${minutes}`);
        });
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

    useEffect(() => {
        setPropertyValues();
    }, [setPropertyValues]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-lg font-bold mb-4">Update Property</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <LocationInputs currentLocation={currentLocation} />
                <AddressInput register={register} errors={errors} generateAddress={generateAddress} />
                <SquareMetersInput register={register} errors={errors} />
                <PriceHistoryInputs fields={fields} register={register} errors={errors} append={append} remove={remove} />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </form>
        </Modal>
    );
}

export default UpdatePropertyModal;
