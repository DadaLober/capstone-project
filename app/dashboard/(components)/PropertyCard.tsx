import React, { useState } from 'react';
import { FaMapMarkerAlt, FaAddressBook } from 'react-icons/fa';
import { SlOptions } from "react-icons/sl";
import { Card, CardContent } from '@/components/ui/card';
import { PropertyInfo } from '@/hooks/types';
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useUserInfo } from '@/hooks/useUserInfo';
import { ReservePropertyModal } from './addReservationForm';
import { AgentReservePropertyModal } from './agentReservePropertyModal';
import { DeleteConfirmationModal } from './deleteConfirmation';

interface PropertyCardProps {
    property: PropertyInfo;
    isSelected: boolean;
    onClick: () => void;
    onDelete: () => void;
    onAddToReserved: (userId: number, date: Date) => void;
    onUpdate: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isSelected, onClick, onDelete, onAddToReserved, onUpdate }) => {
    const { userInfo } = useUserInfo();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const canEdit = userInfo?.role === 'broker';
    const canAddToReserved = userInfo?.role === 'broker' || userInfo?.role === 'agent';
    const canDelete = userInfo?.role === 'broker';

    const ReservationModal = userInfo?.role === 'broker'
        ? ReservePropertyModal
        : AgentReservePropertyModal;

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
                        {(canEdit || canAddToReserved || canDelete) && (
                            <div className="ml-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <SlOptions className="h-4 w-4 mr-1" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="shadow-md rounded-lg z-[500]">
                                        {canEdit && (
                                            <DropdownMenuItem
                                                className="hover:bg-gray-50 focus:outline-none"
                                                onClick={onUpdate}
                                            >
                                                Edit Property
                                            </DropdownMenuItem>
                                        )}
                                        {canAddToReserved && (
                                            <DropdownMenuItem
                                                className="hover:bg-gray-50 focus:outline-none"
                                                onClick={() => setIsModalOpen(true)}
                                            >
                                                Add to Reserved
                                            </DropdownMenuItem>
                                        )}
                                        {canDelete && (
                                            <DropdownMenuItem
                                                className="focus:outline-none text-red-600"
                                                onClick={() => setIsDeleteModalOpen(true)}
                                            >
                                                Delete Property
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-red-500" size={14} />
                            <p className="text-xs text-gray-600">
                                {property.location ? `${property.location.lng}, ${property.location.lat}` : 'Location not available'}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end items-end gap-2">
                        <Badge variant="default">
                            ₱{property.priceHistory?.[property.priceHistory.length - 1]?.price?.toLocaleString() || '0'}
                        </Badge>
                        <Badge variant="secondary">
                            {property.sqm} m²
                        </Badge>
                    </div>
                </CardContent>
            </Card>
            <ReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                propertyId={property.id}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={onDelete}
                propertyAddress={property.address}
            />
        </>
    );
};