'use client';
import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FiX } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';
import { useForm, useFieldArray, useWatch } from "react-hook-form";



interface FormData {
    address: string;
    latitude: number;
    longitude: number;
    size: string;
    price: string;
    attributes: string[];
    files: File[];
}

interface MarkerFormProps {
    selectedPosition: { lat: number; lng: number } | null;
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
}

const FormComp: React.FC<MarkerFormProps> = ({ selectedPosition, address, setAddress }) => {
    const [additionalFields, setAdditionalFields] = useState<number[]>([0]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const addField = () => {
        setAdditionalFields((prevFields) => [...prevFields, prevFields.length]);
    };

    const removeField = (indexToRemove: number) => {
        setAdditionalFields((prevFields) => prevFields.filter((_, index) => index !== indexToRemove));
    };

    const removeFile = (indexToRemove: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setUploadedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const onDrop = (acceptedFiles: File[]) => {
        setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {},
        multiple: true,
    });

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (

        <div className=' relative'>
            <Button onClick={toggleFormVisibility} className="bg-green-400 absolute right-0 top-5  hover:bg-green-700">
                <FiPlus size={24} />
            </Button>
            {isFormVisible && (
                <div
                    className="fixed top-0 right-0 h-full w-96 bg-white p-6 shadow-lg z-50 overflow-scroll pointer-events-none"
                    style={{ pointerEvents: 'auto' }}
                >
                    <div className="relative ">
                        <button
                            className="absolute top-0 items-center right-2 text-gray-600 hover:text-gray-800"
                            onClick={toggleFormVisibility}
                        >
                            <FiX size={24} />
                        </button>
                        <h3 className="font-bold mb-2">Selected Area</h3>
                        <input
                            type="text"
                            className="w-full mb-2 p-2 border rounded"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <input
                            type="text"
                            className="w-full mb-2 p-2 border rounded"
                            placeholder="Latitude"
                            value={selectedPosition ? selectedPosition.lat.toFixed(5) : ''}
                            readOnly
                        />
                        <input
                            type="text"
                            className="w-full mb-2 p-2 border rounded"
                            placeholder="Longitude"
                            value={selectedPosition ? selectedPosition.lng.toFixed(5) : ''}
                            readOnly
                        />
                        <input
                            type="text"
                            className="w-full mb-2 p-2 border rounded"
                            placeholder="Size / sqm"
                        />
                        <input
                            type="text"
                            className="w-full mb-2 p-2 border rounded"
                            placeholder="Price"
                        />
                        <div
                            {...getRootProps()}
                            className={`w-full p-6 border-2 border-dashed rounded-lg mb-4 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                                }`}
                        >
                            <input {...getInputProps()} />
                            {uploadedFiles.length === 0 ? (
                                <p>Drag & drop some files here, or click to select files</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {uploadedFiles.map((file, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Uploaded preview ${index}`}
                                                className="w-full h-auto object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={(event) => removeFile(index, event)}
                                                className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1 hover:bg-red-700 transition-opacity opacity-0 group-hover:opacity-100"
                                            >
                                                <FiX size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <Button
                                type="button"
                                onClick={addField}
                                className=" bg-green-500 mb-3 hover:bg-green-700"
                            >
                                <FiPlus size={18} />Add Field
                            </Button>
                        </div>
                        {additionalFields.map((_, index) => (
                            <div key={index} className="mb-2 flex items-center">
                                <div className="flex-grow">
                                    <label htmlFor={`field-${index}`} className="block mb-1">
                                        Other Attributes
                                    </label>
                                    <div className="flex justify-center items-center">
                                        <input
                                            type="text"
                                            id={`field-${index}`}
                                            className="w-full p-2 border rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeField(index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            <FiX size={20} />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                        <Button
                            type="submit"
                            className="my-3 bg-green-400 w-full hover:bg-green-700 text-white py-2 rounded">
                            Submit
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormComp;
