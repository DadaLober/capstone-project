import React, { useState } from 'react';
import { FaMapMarkerAlt, FaAddressBook } from 'react-icons/fa';
import { SlOptions } from "react-icons/sl";
import { Card, CardContent } from '@/components/ui/card';
import { PropertyInfo } from '@/hooks/types';
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useUserInfo } from '@/hooks/useUserInfo';
import { Button } from "@/components/ui/button"
import { DatePicker } from './DatePicker';
import { UserList } from './UserList';
import Modal from './Modal';

interface PropertyCardProps {
    property: PropertyInfo;
    isSelected: boolean;
    onClick: () => void;
    onDelete: () => void;
    onAddToReserved: (userId: string, date: Date) => void;
    onUpdate: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isSelected, onClick, onDelete, onAddToReserved, onUpdate }) => {
    const { userInfo } = useUserInfo();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    // Mock user data (replace with actual data in a real application)
    const users = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Bob Johnson' },
    ];

    const handleAddToReserved = () => {
        if (selectedUser && selectedDate) {
            onAddToReserved(selectedUser, selectedDate);
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <Card
                className={`mb-4 ${isSelected ? 'border border-blue-500' : ''} hover:shadow-md transition-all duration-300 hover:cursor-pointer`}
                onClick={onClick}
            >
                <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                        <FaAddressBook className="mr-2 text-green-500" size={18} />
                        <div className="flex flex-row">
                            <h2 className="text-l font-semibold leading-tight">
                                {property.address}
                            </h2>
                        </div>
                        {userInfo?.role === 'broker' &&
                            <div className="ml-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger >
                                        <SlOptions className="h-4 w-4 mr-1" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="shadow-md rounded-lg">
                                        <DropdownMenuItem className="hover:bg-gray-50 focus:outline-none" onClick={onUpdate}>
                                            Edit Property
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="hover:bg-gray-50 focus:outline-none" onClick={() => setIsModalOpen(true)}>
                                            Add to Reserved
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="hover:bg-gray-50 focus:outline-none" onClick={onDelete}>
                                            Delete Property
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        }
                    </div>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-red-500" size={14} />
                            <p className="text-xs text-gray-600">
                                {property.location ? `${property.location.lng}, ${property.location.lat}` : 'Location not available'}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end items-end">
                        <Badge variant="secondary">
                            {property.sqm} m²
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <div className="space-y-4">
                    <div>
                        <h3 className="mb-2 font-semibold">Select User</h3>
                        <UserList users={users} onSelectUser={setSelectedUser} />
                    </div>
                    <div>
                        <h3 className="mb-2 font-semibold">Select Date</h3>
                        <DatePicker date={selectedDate} setDate={setSelectedDate} />
                    </div>
                    <Button onClick={handleAddToReserved} disabled={!selectedUser || !selectedDate}>
                        Add to Reserved
                    </Button>
                </div>
            </Modal>
        </>
    );
};