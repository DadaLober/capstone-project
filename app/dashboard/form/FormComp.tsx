
import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FiX } from 'react-icons/fi'; 
import { useDropzone } from 'react-dropzone';

    interface MarkerFormProps {
    selectedPosition: { lat: number; lng: number } | null;
    Address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    }
    const FormComp: React.FC<MarkerFormProps> = ({ selectedPosition, Address, setAddress }) => {
    const [additionalFields, setAdditionalFields] = useState<number[]>([0]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    
    // Function for adding field
    const addField = () => {
        setAdditionalFields((prevFields) => [...prevFields, prevFields.length]);
    };
    // Function for removing field
    const removeField = (indexToRemove: number) => {
        setAdditionalFields((prevFields) => prevFields.filter((_, index) => index !== indexToRemove));
    };
    // Function for removing file
    const removeFile = (indexToRemove: number, event: React.MouseEvent) => {
        event.stopPropagation(); // Para d clickable buong drop zone
        setUploadedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };
    // Function in using dropZone
    const onDrop = (acceptedFiles: File[]) => {
        setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {}, 
        multiple: true,
    });

    return (
        <div className="w-full bg-white p-4 shadow-md">
        <h3 className="font-bold mb-2">Selected Position</h3>
        <input
            type="text"
            className="w-full mb-2 p-2 border rounded"
            placeholder="Address"
            value={Address}
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
            className={`w-full p-6 border-2 border-dashed rounded-lg mb-4 text-center cursor-pointer ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
                
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

        {additionalFields.map((_, index) => (
            <div key={index} className="mb-2 flex  items-center">
                <div className="flex-grow ">
                    <label htmlFor={`field-${index}`} className="block mb-1">
                    Other Attributes: {index + 1}
                    </label>
                    <div className=' flex justify-center items-center '>
                        <input
                        type="text"
                        id={`field-${index}`}
                        className="w-full p-2 border rounded"
                        />
                        <button
                            type="button"
                            onClick={() => removeField(index)}
                            className="ml-2 text-red-500  hover:text-red-700"
                        >
                            <FiX size={20} />   
                        </button>
                    </div>
                </div>
            </div>
        ))}
        
        <Button
            type="button"
            onClick={addField}
            className="mt-2 bg-green-500 hover:bg-green-700"
        >
            Add Field
        </Button>
        </div>
    );
};

export default FormComp;
