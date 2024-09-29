'use client'

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';

import { PropertyInfo, Location } from '@/app/dashboard/(hooks)/types';
import { useGeocode } from '../(hooks)/useGeocode';
import { usePropertySubmission } from '../(hooks)/usePropertySubmission';
import useLocation from '../(hooks)/useLocation';
import FileUpload from './fileUpload';
import LocationInputs from './locationInputs';
import AddressInput from './addressInput';
import SquareMetersInput from './squareMetersInput';
import PriceHistoryInputs from './priceHistoryInputs';
import { SubmitButton } from './customButtons';
import Modal from './Modal';

interface AddFormModalProps {
    isOpen: boolean;
    location: Location;
    onClose: () => void;
}

function AddFormModal({ isOpen, onClose, location }: AddFormModalProps) {
    const geocode = useGeocode;
    const { mutate: submitProperty, isPending } = usePropertySubmission();
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
        const newData = {
            ...data,
            location: currentLocation,
            sqm: Number(data.sqm),
            priceHistory: data.priceHistory?.map(item => ({
                price: typeof item.price === 'string' ? Number(item.price) || 0 : item.price,
                time: new Date(item.time).toISOString()
            }))
        };

        submitProperty({ data: newData, files: uploadedFiles }, {
            onSuccess: () => {
                reset();
                setUploadedFiles([]);
                onClose();
            },
            onError: (error) => {
                console.error('Error submitting property:', error);
            }
        });
    };

    const generateAddress = async () => {
        if (currentLocation.lat && currentLocation.lng) {
            try {
                const result = await geocode(currentLocation.lat, currentLocation.lng);
                if (result) {
                    setValue('address', result.display_name);
                }
            } catch (error) {
                console.error('Error generating address:', error);
            }
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup function to revoke object URLs
            uploadedFiles.forEach(file => {
                if (file instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(file));
                }
            });
        };
    }, [uploadedFiles]);

    useEffect(() => {
        if (fields.length === 0) {
            append({ price: 0, time: '' });
        }
    }, [fields, append]);

    const handleClose = () => {
        reset();
        setUploadedFiles([]);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="bg-white p-4 w-auto rounded-lg shadow-lg max-w-2xl mx-auto">
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
        </Modal>
    );
}

export default AddFormModal;