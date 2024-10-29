"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PropertyInfo, FileData } from '@/hooks/types';
import { useGeocode } from '../../../hooks/useGeocode';
import { useProperties } from '../../../hooks/useProperties';
import useLocation from '../../../hooks/useLocation';
import LocationInputs from './locationInputs';
import AddressInput from './addressInput';
import SquareMetersInput from './squareMetersInput';
import PriceInput from './priceInput';
import FileUpload from './fileUpload';
import axios from 'axios';
import Modal from './Modal';
import { CheckCircle, MapPin, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface UpdatePropertyModalProps {
    isOpen: boolean;
    property: PropertyInfo | null;
    onClose: () => void;
}

function UpdatePropertyModal({ isOpen, onClose, property }: UpdatePropertyModalProps) {
    const geocode = useGeocode;
    const { editMutation } = useProperties();
    const currentLocation = useLocation(property?.location || { lat: 0, lng: 0 });
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<FileData[]>([]);
    const [isDeletingFile, setIsDeletingFile] = useState(false);
    const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting }, watch } = useForm<PropertyInfo>({
        defaultValues: {
            createdAt: new Date().toISOString(),
            otherAttributes: { "hello": "world" },
        }
    });
    const { remove } = useFieldArray({
        control,
        name: 'priceHistory'
    });

    const address = watch('address');
    const sqm = watch('sqm');

    const onSubmit = async (data: PropertyInfo) => {
        if (!property) {
            return;
        }

        const newData = {
            ...property,
            createdAt: property.createdAt || new Date().toISOString(),
            otherAttributes: { "hello": "world" },
            address: data.address,
            sqm: Number(data.sqm),
            location: currentLocation,
        };

        try {
            await editMutation.mutateAsync(newData);

            // Upload new files
            if (uploadedFiles.length > 0) {
                const formData = new FormData();
                uploadedFiles.forEach((file) => {
                    formData.append('file', file);
                });
                await axios.post(`/api/uploadFile?id=${property.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            toast(
                'Property Updated Successfully!',
                {
                    description: (
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-1" />
                                {address}
                            </div>
                            <p className="text-sm text-gray-600">
                                Square Meters: {sqm}m²
                            </p>
                            <div className="flex items-center text-sm text-gray-600">
                                <ImageIcon className="w-4 h-4 mr-1" />
                                {uploadedFiles.length} new photos added
                            </div>
                        </div>
                    ),
                    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                    duration: 5000,
                    className: "bg-white dark:bg-gray-800"
                }
            );

            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data);
                toast.error('Failed to update property', {
                    description: error.response?.data?.message || 'An unexpected error occurred',
                    icon: <AlertCircle className="w-5 h-5 text-red-500" />
                });
            }
        }
    };

    const handleImageDeletion = async (fileId: number) => {
        if (property) {
            setIsDeletingFile(true);
            try {
                await axios.delete(`/api/properties/${property.id}/files/${fileId}`);
                setExistingImages(prevImages => prevImages.filter(img => img.id !== fileId));
                toast.success('Image deleted successfully', {
                    icon: <CheckCircle className="w-5 h-5 text-green-500" />
                });
            } catch (error) {
                console.error('Error removing file:', error);
                toast.error('Failed to delete image', {
                    icon: <AlertCircle className="w-5 h-5 text-red-500" />
                });
            } finally {
                setIsDeletingFile(false);
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
                if (result) {
                    setValue('address', result.display_name);
                    toast.success('Address generated successfully', {
                        description: result.display_name,
                        icon: <MapPin className="w-5 h-5 text-green-500" />
                    });
                }
            } catch (error) {
                console.error('Error generating address:', error);
                toast.error('Failed to generate address', {
                    icon: <AlertCircle className="w-5 h-5 text-red-500" />
                });
            }
        }
    };

    const handleClose = () => {
        reset();
        remove();
        setUploadedFiles([]);
        setExistingImages([]);
        onClose();
    };

    useEffect(() => {
        let isMounted = true;

        if (isOpen && property) {
            setPropertyValues();
            const fetchImages = async () => {
                try {
                    const response = await fetch(`/api/getImages?id=${property.id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch images');
                    }
                    const imageData: FileData[] = await response.json();
                    if (isMounted) {
                        setExistingImages(imageData);
                    }
                } catch (error) {
                    console.error('Error fetching images:', error);
                    toast.error('Failed to load existing images', {
                        icon: <AlertCircle className="w-5 h-5 text-red-500" />
                    });
                }
            };
            fetchImages();
        }

        return () => {
            isMounted = false;
            setUploadedFiles([]);
            setExistingImages([]);
        };
    }, [isOpen, property?.id]);

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="p-4 w-auto max-w-2xl mx-auto">
                <h2 className="text-lg font-bold mb-4">Update Property</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                    <LocationInputs currentLocation={currentLocation} />
                    <AddressInput register={register} errors={errors} generateAddress={generateAddress} />
                    <SquareMetersInput register={register} errors={errors} />
                    <PriceInput register={register} errors={errors} />
                    <FileUpload
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
                        existingImages={existingImages}
                        setExistingImages={setExistingImages}
                        property={property}
                        onImageDelete={handleImageDeletion}
                    />
                    <Button type="submit" disabled={isSubmitting || editMutation.isPending}>
                        {isSubmitting || editMutation.isPending ? 'Updating...' : 'Update'}
                    </Button>
                </form>
            </div>
        </Modal>
    );
}

export default UpdatePropertyModal;