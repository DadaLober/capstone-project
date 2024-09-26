import React, { useEffect, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { PropertyInfo, Location } from '@/app/dashboard/(hooks)/types';
import { useNominatimGeocode } from '../(hooks)/useGeocode';
import useLocation from '../(hooks)/useLocation';
import FileUpload from './fileUpload';
import LocationInputs from './locationInputs';
import AddressInput from './addressInput';
import SquareMetersInput from './squareMetersInput';
import PriceHistoryInputs from './priceHistoryInputs';
import { SubmitButton, CloseButton } from './customButtons';

import '@/app/dashboard/(components)/modal.css';

interface AddFormModalProps {
    isOpen: boolean;
    location: Location;
    onClose: () => void;
}

function AddFormModal({ isOpen, onClose, location }: AddFormModalProps) {
    const queryClient = useQueryClient();
    const currentLocation = useLocation(location);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<PropertyInfo>({
        defaultValues: {
            createdAt: new Date().toISOString(),
            otherAttributes: { "hello": "world" },
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'priceHistory',
        rules: { minLength: 1 }
    });

    const onSubmit: SubmitHandler<PropertyInfo> = async (data) => {
        console.log(data);
        const newData = {
            ...data,
            location: currentLocation,
            sqm: Number(data.sqm),
            priceHistory: data.priceHistory?.map(item => ({
                price: typeof item.price === 'string' ? Number(item.price) || 0 : item.price,
                time: new Date(item.time).toISOString()
            }))
        };

        try {
            console.log(newData);
            const response = await axios.post('/api/addProperty', newData);
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            console.log(response.data);
            reset();
        } catch (error) {
            if (isAxiosError(error)) {
                console.error(error.response?.data);
            }
        }
    };

    const generateAddress = async () => {
        if (currentLocation.lat && currentLocation.lng) {
            try {
                const result = await useNominatimGeocode(currentLocation.lat, currentLocation.lng);
                if (result) {
                    setValue('address', result.display_name);
                }
            } catch (error) {
                console.error('Error generating address:', error);
            }
        }
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    useEffect(() => {
        if (fields.length === 0) {
            append({ price: 0, time: new Date().toISOString() });
        }
    }, [fields, append]);

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <div className={`modal ${isOpen ? 'is-open' : ''}`}>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
                    <h2 className="text-lg font-bold mb-4">Add Property</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                        <LocationInputs currentLocation={currentLocation} />
                        <AddressInput register={register} errors={errors} generateAddress={generateAddress} />
                        <SquareMetersInput register={register} errors={errors} />
                        <PriceHistoryInputs fields={fields} register={register} errors={errors} append={append} remove={remove} />
                        <FileUpload uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
                        <SubmitButton isSubmitting={isSubmitting} />
                    </form>
                </div>
                <CloseButton handleClose={handleClose} />
            </div>
        </div>
    );
}

export default AddFormModal;