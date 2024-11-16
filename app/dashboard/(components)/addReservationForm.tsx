import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import Modal from './Modal';
import { Search, User, Calendar, CheckCircle, XCircle, Loader2, Undo2 } from 'lucide-react';
import { useReservations } from '@/hooks/useReservations';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    roles: string[];
    status: string;
}

interface ReservePropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: number;
}

interface FormValues {
    userId: number | null;
    reservationDate: string;
}

interface UserListProps {
    users: User[];
    selectedUserId: number | null;
    onSelectUser: (userId: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, selectedUserId, onSelectUser }) => {
    return (
        <div className="max-h-60 overflow-y-auto bg-white rounded-md shadow-sm">
            <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                    <li key={user.id} className="py-2">
                        <button
                            type="button"
                            onClick={() => onSelectUser(user.id)}
                            className={`w-full text-left px-4 py-2 transition-colors duration-150 ease-in-out ${selectedUserId === user.id
                                ? 'bg-blue-100 hover:bg-blue-200'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center">
                                <User className="w-5 h-5 mr-2 text-gray-500" />
                                <div>
                                    <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const ReservePropertyModal: React.FC<ReservePropertyModalProps> = ({
    isOpen,
    onClose,
    propertyId
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { mutation: createReservation, deleteMutation } = useReservations();

    const { control, handleSubmit, watch, reset, formState: { errors, isValid } } = useForm<FormValues>({
        defaultValues: {
            userId: null,
            reservationDate: '',
        },
        mode: 'onChange'
    });

    const selectedUserId = watch('userId');
    const reservationDate = watch('reservationDate');

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get<User[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
                setUsers(response.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401 || err.response?.status === 402) {
                        setError('Authentication error. Please log in again.');
                    } else if (err.response?.status === 403) {
                        setError('You are not authorized to view this information.');
                    } else {
                        setError('Error fetching users. Please try again later.');
                    }
                } else {
                    setError('An unexpected error occurred. Please try again later.');
                }
                console.error('Error fetching users:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchUsers();
            reset();
            setSearchTerm('');
        }
    }, [isOpen, reset]);

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (data.userId !== null && data.reservationDate) {
            const selectedUser = users.find(user => user.id === data.userId);
            const formattedDate = new Date(data.reservationDate).toLocaleString();

            try {
                await createReservation.mutateAsync({
                    propertyId,
                    userId: data.userId,
                    reservationDate: new Date(data.reservationDate).toISOString(),
                });
                toast.success(
                    <div className="flex flex-col gap-1">
                        <p className="font-semibold">Reservation Created Successfully!</p>
                        <p className="text-sm text-gray-600">
                            Reserved for: {selectedUser?.firstName} {selectedUser?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                            Date: {formattedDate}
                        </p>
                    </div>,
                );
                onClose();
            } catch (err) {
                const errorMessage = axios.isAxiosError(err)
                    ? err.response?.data?.message || 'Failed to create reservation'
                    : 'An unexpected error occurred';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        }
    };

    const selectedUser = users.find(user => user.id === selectedUserId);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
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
                        <User className="w-5 h-5 mr-2" />
                        Select User
                    </h3>
                    <div className="mb-4 relative">
                        <Input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10"
                        />
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                            <span className="ml-2 text-gray-600">Loading users...</span>
                        </div>
                    ) : error ? (
                        <p className="text-red-500 flex items-center">
                            <XCircle className="w-5 h-5 mr-2" />
                            {error}
                        </p>
                    ) : (
                        <>
                            <Controller
                                name="userId"
                                control={control}
                                rules={{ required: 'Please select a user' }}
                                render={({ field }) => (
                                    <UserList
                                        users={filteredUsers}
                                        selectedUserId={field.value}
                                        onSelectUser={(id) => field.onChange(id)}
                                    />
                                )}
                            />
                            {errors.userId && (
                                <p className="text-red-500 mt-2">{errors.userId.message}</p>
                            )}
                            {filteredUsers.length === 0 && (
                                <p className="text-gray-500 mt-2 flex items-center">
                                    <XCircle className="w-5 h-5 mr-2" />
                                    No users found matching your search.
                                </p>
                            )}
                            {selectedUser && (
                                <div className="mt-2 p-2 bg-blue-50 rounded-md flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
                                    <p className="text-sm text-blue-700">
                                        Selected user: <span className="font-medium">{`${selectedUser.firstName} ${selectedUser.lastName}`}</span>
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
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

export default ReservePropertyModal;