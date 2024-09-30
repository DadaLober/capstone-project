import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa';
import Image from 'next/image';
import { PropertyInfo, FileData } from '../(hooks)/types';


interface FileUploadProps {
    uploadedFiles: File[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    existingImages?: FileData[];
    setExistingImages?: React.Dispatch<React.SetStateAction<FileData[]>>;
    property?: PropertyInfo | null;
    onImageDelete?: (fileId: number) => Promise<void>;
}

function FileUpload({ uploadedFiles, setUploadedFiles, existingImages = [], setExistingImages, property, onImageDelete }: FileUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setUploadedFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, [setUploadedFiles]);

    const removeFile = (index: number, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const removeExistingImage = async (fileId: number, index: number, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (setExistingImages && property) {
            try {
                console.log('Removing file with ID:', fileId);
                await onImageDelete?.(fileId);
                setExistingImages(prevImages => prevImages.filter((_, i) => i !== index));
            } catch (error) {
                console.error('Error removing file:', error);
            }
        }
    };


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
            'application/pdf': ['.pdf'],
            'video/mp4': ['.mp4'],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    const getFileType = (file: FileData) => {
        if (file.uri.toLowerCase().endsWith('.pdf')) return 'pdf';
        if (file.uri.toLowerCase().endsWith('.mp4')) return 'video';
        return 'image';
    };

    const getFileName = (url: string) => {
        return url.split('/').pop() || 'Unknown file';
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ease-in-out ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
            >
                <input {...getInputProps()} />
                <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                    {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select files'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    Supported formats: JPEG, PNG, PDF, MP4 (Max 10MB)
                </p>
            </div>

            {existingImages.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Existing Files</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {existingImages.map((file, index) => {
                            const fileType = getFileType(file);
                            const fileName = getFileName(file.uri);
                            return (
                                <div key={`existing-${index}`} className="relative">
                                    {fileType === 'image' && (
                                        <Image
                                            src={file.imageUrl}
                                            alt={file.fileName}
                                            width={100}
                                            height={100}
                                            className="w-full h-24 object-cover rounded-md"
                                        />
                                    )}
                                    {fileType === 'video' && (
                                        <video
                                            src={file.imageUrl}
                                            className="w-full h-24 object-cover rounded-md"
                                        />
                                    )}
                                    {fileType === 'pdf' && (
                                        <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded-md">
                                            <FaFilePdf className="h-12 w-12 text-red-500" />
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => removeExistingImage(file.id, index, e)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <FiX className="h-4 w-4" />
                                    </button>
                                    <p className="mt-1 text-xs text-gray-600 truncate" title={fileName}>
                                        {fileName.length > 20 ? fileName.slice(0, 17) + '...' : fileName}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {uploadedFiles.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Uploaded Files</h3>
                    <div className="flex flex-row flex-wrap gap-4">
                        {uploadedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center p-2 bg-gray-50 rounded-md"
                            >
                                <div className="flex items-center">
                                    {file.type.startsWith('video/') && (
                                        <video
                                            src={URL.createObjectURL(file)}
                                            className="h-10 w-10 object-cover mr-2"
                                        />
                                    )}
                                    {file.type.startsWith('image/') && (
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            width={20}
                                            height={20}
                                            className="object-cover mr-2 w-6 h-6"
                                        />
                                    )}
                                    {file.type === 'application/pdf' && (
                                        <FaFilePdf className="h-8 w-8 text-red-500" />
                                    )}
                                    {!file.type.startsWith('video/') && !file.type.startsWith('image/') && file.type !== 'application/pdf' && (
                                        <FiFile className="h-10 w-10 text-gray-400 mr-2" />
                                    )}
                                    <span className="text-sm text-gray-700 truncate" title={file.name}>
                                        {file.name.length > 25
                                            ? `${file.name.slice(0, 12)}...${file.name.slice(-5)}`
                                            : file.name}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => removeFile(index, e)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
export default FileUpload;