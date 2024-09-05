"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PropertyInfo } from '@/app/test/(components)/types';
import '@/app/test/(components)/modal.css';

interface AddFormModalProps {
    isOpen: boolean;
    location: { lat: number; lng: number; };
    onClose: () => void;
}

const useLocation = (location: { lat: number; lng: number; }) => {
    const [currentLocation, setCurrentLocation] = useState(location);

    useEffect(() => {
        setCurrentLocation({ ...location });
    }, [location]);

    return currentLocation;
};

function AddFormModal({ isOpen, onClose, location }: AddFormModalProps) {
    const currentLocation = useLocation(location);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PropertyInfo>();
    const onSubmit = (data: PropertyInfo) => {
        const newData = { ...data, location: currentLocation };
        console.log(newData);
        // Handle form submission
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
                            {...register('sqm'), { valueAsNumber: true }}
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