import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { PropertyInfo, Location } from '@/hooks/types';
import { useGeocode } from '../../../hooks/useGeocode';
import { usePropertySubmission } from '../../../hooks/usePropertySubmission';
import useLocation from '../../../hooks/useLocation';
import FileUpload from './fileUpload';
import LocationInputs from './locationInputs';
import AddressInput from './addressInput';
import SquareMetersInput from './squareMetersInput';
import PriceHistoryInputs from './priceHistoryInputs';
import { SubmitButton } from './customButtons';
import Modal from './Modal';
import { CheckCircle, MapPin } from 'lucide-react';

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
    const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting }, watch } = useForm<PropertyInfo>({
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

    const address = watch('address');
    const priceHistory = watch('priceHistory');

    const onSubmit: SubmitHandler<PropertyInfo> = async (data) => {
        const newData = {
            ...data,
            location: currentLocation,
            sqm: Number(data.sqm),
            priceHistory: data.priceHistory?.map(item => ({
                price: typeof item.price === 'string' ? Number(item.price) || 0 : item.price,
                time: new Date().toISOString(),
            }))
        };

        submitProperty({ data: newData, files: uploadedFiles }, {
            onSuccess: () => {
                const latestPrice = priceHistory?.[priceHistory.length - 1]?.price;
                const formattedPrice = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(Number(latestPrice));

                toast.success(
                    'Property Added Successfully!',
                    {
                        description: (
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {address}
                                </div>
                                <p className="text-sm text-gray-600">
                                    Listed Price: {formattedPrice}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {uploadedFiles.length} files uploaded
                                </p>
                            </div>
                        ),
                        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                        duration: 5000,
                        className: "bg-white dark:bg-gray-800"
                    }
                );

                reset();
                setUploadedFiles([]);
                onClose();
            },
            onError: (error) => {
                console.error('Error submitting property:', error);
                toast.error('Failed to add property. Please try again.');
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
                toast.error('Failed to generate address from location.');
            }
        }
    };

    useEffect(() => {
        return () => {
            uploadedFiles.forEach(file => {
                if (file instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(file));
                }
            });
        };
    }, [uploadedFiles]);

    const handleClose = () => {
        reset();
        setUploadedFiles([]);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="w-auto max-w-2xl mx-auto rounded-lg">
                <h2 className="text-lg font-bold mb-4 text-foreground">Add Property</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                    <LocationInputs currentLocation={currentLocation} />
                    <AddressInput register={register} errors={errors} generateAddress={generateAddress} />
                    <SquareMetersInput register={register} errors={errors} />
                    <PriceHistoryInputs fields={fields} register={register} errors={errors} append={append} remove={remove} />
                    <FileUpload uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
                    <SubmitButton isSubmitting={isPending} />
                </form>
            </div>
        </Modal>
    );
}

export default AddFormModal;