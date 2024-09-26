import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';

interface FileUploadProps {
    uploadedFiles: File[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

function FileUpload({ uploadedFiles, setUploadedFiles }: FileUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setUploadedFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, [setUploadedFiles]);

    const removeFile = (index: number) => {
        setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
            'application/pdf': ['.pdf'],
        },
        maxSize: 5 * 1024 * 1024, // 5MB
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ease-in-out ${isDragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
            >
                <input {...getInputProps()} />
                <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                    {isDragActive
                        ? 'Drop the files here...'
                        : 'Drag & drop files here, or click to select files'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    Supported formats: JPEG, PNG, PDF, JFIF (Max 5MB)
                </p>
            </div>

            {uploadedFiles.length > 0 && (
                <ul className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                        >
                            <div className="flex items-center">
                                {file.type.startsWith('image/') && (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="h-10 w-10 object-cover mr-2"
                                    />
                                )}
                                <FiFile className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-700 truncate">
                                    {file.name}
                                </span>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FileUpload;