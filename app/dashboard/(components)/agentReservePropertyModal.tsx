import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import Modal from './Modal';
import { Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { useReservations } from '@/hooks/useReservations';
import { useUserInfo } from '@/hooks/useUserInfo';

interface AgentReservePropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: number;
}

interface FormValues {
    reservationDate: string;
}

export const AgentReservePropertyModal: React.FC<AgentReservePropertyModalProps> = ({
    isOpen,
    onClose,
    propertyId
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { mutation: createReservation } = useReservations();
    const { userInfo } = useUserInfo();

    const { control, handleSubmit, watch, reset, formState: { errors, isValid } } = useForm<FormValues>({
        defaultValues: {
            reservationDate: '',
        },
        mode: 'onChange'
    });

    const reservationDate = watch('reservationDate');

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!userInfo?.id) {
            toast.error('User information not available');
            return;
        }

        setIsLoading(true);
        try {
            await createReservation.mutateAsync({
                propertyId,
                userId: userInfo.id,
                reservationDate: new Date(data.reservationDate).toISOString(),
            });

            toast.success(
                <div className="flex flex-col gap-1">
                    <p className="font-semibold">Reservation Created Successfully!</p>
                    <p className="text-sm text-gray-600">
                        Date: {new Date(data.reservationDate).toLocaleString()}
                    </p>
                </div>,
            );

            onClose();
            reset();
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Failed to create reservation';

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit)();
            }} className="space-y-6 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-6 h-6 mr-2" />
                    Reserve Property
                </h2>

                <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Select Reservation Date
                    </h3>
                    <Controller
                        name="reservationDate"
                        control={control}
                        rules={{
                            required: 'Please select a reservation date',
                            validate: (value) => {
                                const selectedDate = new Date(value);
                                const now = new Date();
                                return selectedDate > now || 'Reservation date cannot be in the past';
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                type="datetime-local"
                                placeholder="Select reservation date and time"
                                {...field}
                            />
                        )}
                    />
                    {errors.reservationDate && (
                        <p className="text-red-500 mt-2">{errors.reservationDate.message}</p>
                    )}
                    {reservationDate && !errors.reservationDate && (
                        <div className="mt-2 p-2 bg-green-50 rounded-md flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                            <p className="text-sm text-green-700">
                                Selected date: <span className="font-medium">{new Date(reservationDate).toLocaleString()}</span>
                            </p>
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || !isValid || createReservation.isPending}
                    className="w-full py-2 text-lg transition-colors duration-150 ease-in-out flex items-center justify-center gap-2"
                >
                    {createReservation.isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Reservation...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Add to Reserved
                        </>
                    )}
                </Button>
            </form>
        </Modal>
    );
};

export default AgentReservePropertyModal;