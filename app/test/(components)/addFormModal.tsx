"use client";

import axios, { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PropertyInfo } from '@/app/test/(hooks)/types';
import '@/app/test/(components)/modal.css';

interface AddFormModalProps {
    isOpen: boolean;
    location: { lng: number; lat: number; };
    onClose: () => void;
}

const useLocation = (location: { lng: number; lat: number; }) => {
    const [currentLocation, setCurrentLocation] = useState(location);

    useEffect(() => {
        setCurrentLocation({ ...location });
    }, [location]);

    return currentLocation;
};

function AddFormModal({ isOpen, onClose, location }: AddFormModalProps) {
    const currentLocation = useLocation(location);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PropertyInfo>(
        {
            defaultValues: {
                priceHistory: [{ date: new Date().toISOString(), price: 0 }],
                createdAt: new Date().toISOString(),
                otherAttributes: { "hello": "world" },
            }
        }
    );
    const onSubmit = async (data: PropertyInfo) => {
        const newData = { ...data, location: currentLocation, sqm: Number(data.sqm) };
        console.log(newData);
        try {
            const response = await axios.post('/api/addProperty', newData);
            console.log(response.data);
        } catch (error: any) {
            if (isAxiosError(error)) {
                console.error(error.response?.data);
            }
        }
    };

    return (
        <div className={`modal ${isOpen ? 'is-open' : ''}`}>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-lg font-bold mb-4">Add Property</h2>
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
                        <Input
                            type="text"
                            placeholder="Address"
                            {...register('address')}
                        />
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
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </form>
                </div>
                <Button className="modal-close-button flex-shrink-0" aria-label="close" onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
}

export default AddFormModal;