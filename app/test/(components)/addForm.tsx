"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import type { PropertyInfo } from '@/app/test/(components)/types';
import '@/app/test/(components)/modal.css';

interface AddFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    location: { lat: number; lng: number; };
}

function AddFormModal({ isOpen, onClose, location }: AddFormModalProps) {
    const [currentLocation, setCurrentLocation] = useState(location);
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<PropertyInfo>({
        defaultValues: {
            location: {
                lat: location.lat,
                lng: location.lng,
            },
            address: '',
            sqm: 0,
        }
    });

    React.useEffect(() => {
        setCurrentLocation(location);
    }, [location]);

    const onSubmit = (data: PropertyInfo) => {
        const newData = { ...data, location: currentLocation };
        console.log(newData);
        // Handle form submission
    };

    return (
        <div className={`modal ${isOpen ? 'is-open' : ''}`}>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-lg font-bold mb-4">{isOpen ? 'Edit Property' : 'Add Property'}</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                        <Controller
                            name="location.lat"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    {...field}
                                    placeholder="Latitude"
                                    className="block w-full p-2 rounded-lg border border-gray-300"
                                    value={location.lat}
                                    disabled
                                />
                            )}
                        />
                        <Controller
                            name="location.lng"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    {...field}
                                    placeholder="Longitude"
                                    className="block w-full p-2 rounded-lg border border-gray-300"
                                    value={location.lng}
                                    disabled
                                />
                            )}
                        />
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    {...field}
                                    placeholder="Address"
                                    className="block w-full p-2 rounded-lg border border-gray-300"
                                />
                            )}
                        />
                        <Controller
                            name="sqm"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="number"
                                    {...field}
                                    placeholder="Square meters"
                                    className="block w-full p-2 rounded-lg border border-gray-300"
                                />
                            )}
                        />

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

export default AddFormModal
