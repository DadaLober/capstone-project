"use client";

import { isAxiosError } from 'axios';
import { useForm, useFieldArray } from 'react-hook-form';
import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PropertyInfo, Location } from '@/app/dashboard/(hooks)/types';
import { useQueryClient } from '@tanstack/react-query';
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { PiMagicWand } from "react-icons/pi";
import { useNominatimGeocode } from '../(hooks)/useGeocode';
import { useProperties } from '../(hooks)/useProperties';
import '@/app/dashboard/(components)/modal.css';

interface AddFormModalProps {
    isOpen: boolean;
    property: PropertyInfo | null;
    onClose: () => void;
}

const useLocation = (location: Location) => {
    const [currentLocation, setCurrentLocation] = useState(location);

    const memoizedLocation = useMemo(() => ({ ...location }), [location.lat, location.lng]);

    useEffect(() => {
        setCurrentLocation(memoizedLocation);
    }, [memoizedLocation]);

    return currentLocation;
};

function AddFormModal({ isOpen, onClose, property }: AddFormModalProps) {
    const queryClient = useQueryClient();
    const { editMutation: editProperty } = useProperties();
    const currentLocation = useLocation(property?.location || { lat: 0, lng: 0 });
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<PropertyInfo>(
        {
            defaultValues: {
                createdAt: new Date().toISOString(),
                otherAttributes: { "hello": "world" },
            }
        }
    );
    const { fields, append, remove } = useFieldArray({
        control: useForm<PropertyInfo>().control,
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
            reset();
            return;
        } catch (error: any) {
            if (isAxiosError(error)) {
                console.error(error.response?.data);
            }
        }
    };

    const setPropertyValues = () => {
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
    };

    useEffect(() => {
        setPropertyValues();
    }, [property]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const generateAddress = async () => {
        if (currentLocation.lat && currentLocation.lng) {
            try {
                const result = await useNominatimGeocode(currentLocation.lat, currentLocation.lng);
                console.log(result);
                if (result) {
                    setValue('address', result.display_name);
                }
            } catch (error) {
                console.error('Error generating address:', error);
            }
        }
    };

    return (
        <div className={`modal ${isOpen ? 'is-open' : ''}`}>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
                    <h2 className="text-lg font-bold mb-4">Update Property</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                        <Input
                            type="text"
                            placeholder="Latitude"
                            value={`Latitude: ${currentLocation.lat}`}
                            disabled
                        />
                        <Input
                            type="text"
                            placeholder="Latitude"
                            value={`Longitude: ${currentLocation.lng}`}
                            disabled
                        />
                        <div className="flex justify-between mb-4">
                            <Input
                                type="text"
                                placeholder="Address"
                                {...register('address', {
                                    required: "Address is required",
                                })}
                            />
                            <Button type="button" onClick={generateAddress} className="ml-3" variant="secondary">
                                <PiMagicWand />
                            </Button>
                        </div>
                        {errors.address && (<p className="text-red-500 text-sm">{errors.address.message}</p>)}
                        <Input
                            type="number"
                            placeholder="Square meters"
                            {...register("sqm", {
                                required: "Square meter is required",
                                pattern: {
                                    value: /^[1-9]\d*$/,
                                    message: "Square meter must be a positive number greater than 0"
                                }
                            })}
                        />
                        {errors.sqm && (<p className="text-red-500 text-sm">{errors.sqm.message}</p>)}
                        <div className="flex items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold">Price History</h3>
                            </div>
                            <button type="button" onClick={() => append({ price: 0, time: '' })} className="ml-auto">
                                <MdOutlineAddCircleOutline />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {fields.map((item, index) => (
                                <div key={item.id} className="flex flex-col">
                                    <div className="flex space-x-2">
                                        <Input
                                            type="number"
                                            placeholder="Price"
                                            {...register(`priceHistory.${index}.price`, {
                                                required: "Price is required",
                                                pattern: {
                                                    value: /^[1-9]\d*$/,
                                                    message: "Price must be a positive number greater than 0"
                                                }
                                            })}
                                        />
                                        <Input
                                            type="datetime-local"
                                            placeholder="Time"
                                            {...register(`priceHistory.${index}.time`, {
                                                required: "Time is required",
                                                validate: value => {
                                                    const selectedTime = new Date(value);
                                                    const currentTime = new Date();
                                                    return selectedTime <= currentTime || "Time cannot be in the future";
                                                }
                                            })}
                                        />
                                        <Button type="button" onClick={() => remove(index)}>Remove</Button>
                                    </div>
                                    {errors.priceHistory?.[index]?.price && (
                                        <p className="text-red-500 text-sm ml-2">Price: {errors.priceHistory[index].price.message}</p>
                                    )}
                                    {errors.priceHistory?.[index]?.time && (
                                        <p className="text-red-500 text-sm ml-2">Time: {errors.priceHistory[index].time.message}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </form>
                </div>
                <Button className="modal-close-button flex-shrink-0" aria-label="close" onClick={handleClose}>
                    Close
                </Button>
            </div >
        </div >
    );
}
export default AddFormModal;