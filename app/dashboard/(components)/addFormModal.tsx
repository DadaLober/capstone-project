"use client";

import axios, { isAxiosError } from 'axios';
import { useForm, useFieldArray } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PropertyInfo, Location } from '@/app/dashboard/(hooks)/types';
import { useQueryClient } from '@tanstack/react-query';
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { PiMagicWand } from "react-icons/pi";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import '@/app/dashboard/(components)/modal.css';
import { useNominatimGeocode } from '../(hooks)/useGeocode';
import useLocation from '../(hooks)/useLocation';
import { useDropzone } from 'react-dropzone';

interface AddFormModalProps {
    isOpen: boolean;
    location: Location;
    onClose: () => void;
}

function AddFormModal({ isOpen, onClose, location }: AddFormModalProps) {
    const queryClient = useQueryClient();
    const currentLocation = useLocation(location);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
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
        const newData = { ...data, location: currentLocation, sqm: Number(data.sqm) };
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
            const response = await axios.post('/api/addProperty', newData,);
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            console.log(response.data);
            reset();
            return;
        } catch (error: any) {
            if (isAxiosError(error)) {
                console.error(error.response?.data);
            }
        }
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

    const onDrop = (acceptedFiles: File[]) => {
        setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
    };

    const removeFile = (index: number) => {
        setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true // Allow multiple files
    });

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return (): void => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

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

                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center mb-4">
                                <h3 className="text-lg font-bold">Price History</h3>
                                <button type="button" onClick={() => append({ price: 0, time: '' })} className="ml-auto">
                                    <MdOutlineAddCircleOutline />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <div className="flex space-x-2">
                                        <Input
                                            type="number"
                                            placeholder="Price"
                                            {...register(`priceHistory.0.price`, {
                                                required: "Price is required",
                                                min: {
                                                    value: 0,
                                                    message: "Price must be a positive number"
                                                }
                                            })}
                                        />
                                        <Input
                                            type="datetime-local"
                                            placeholder="Time"
                                            {...register(`priceHistory.0.time`, {
                                                required: "Time is required",
                                                validate: value => {
                                                    const selectedTime = new Date(value);
                                                    const currentTime = new Date();
                                                    return selectedTime <= currentTime || "Time cannot be in the future";
                                                }
                                            })}
                                        />
                                    </div>
                                    {errors.priceHistory?.[0]?.price && (
                                        <p className="text-red-500 text-sm">{errors.priceHistory[0].price.message}</p>
                                    )}
                                    {errors.priceHistory?.[0]?.time && (
                                        <p className="text-red-500 text-sm">{errors.priceHistory[0].time.message}</p>
                                    )}
                                </div>

                                {fields.slice(1).map((item, index) => (
                                    <div key={item.id} className="flex flex-col mt-2">
                                        <div className="flex space-x-2">
                                            <Input
                                                type="number"
                                                placeholder="Price"
                                                {...register(`priceHistory.${index + 1}.price`, {
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
                                                {...register(`priceHistory.${index + 1}.time`, {
                                                    required: "Time is required",
                                                    validate: value => {
                                                        const selectedTime = new Date(value);
                                                        const currentTime = new Date();
                                                        return selectedTime <= currentTime || "Time cannot be in the future";
                                                    }
                                                })}
                                            />
                                            <Button type="button" onClick={() => remove(index + 1)} className="ml-auto">
                                                Remove
                                            </Button>
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
                        </div>

                        <div {...getRootProps()} className="dropzone border-2 border-dashed border-gray-400 p-4 rounded-md flex flex-col items-center justify-center cursor-pointer">
                            <input {...getInputProps()} />
                            <p className="text-gray-500">Drag files here, or click to select files</p>
                        </div>
                        <div className="mt-4">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="file-item flex items-center p-2 border-b border-gray-200">
                                    <p className="flex-grow text-gray-700">{file.name}</p>
                                    <button type="button" onClick={() => removeFile(index)} className="remove-file-button ml-4">
                                        <IoIosRemoveCircleOutline />
                                    </button>
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