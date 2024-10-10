'use client'

import { FaMapMarkerAlt, FaAddressBook } from 'react-icons/fa';
import { SlOptions } from "react-icons/sl";
import { Card, CardContent } from '@/components/ui/card';
import { PropertyInfo } from '@/app/dashboard/(hooks)/types';
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface PropertyCardProps {
    property: PropertyInfo;
    isSelected: boolean;
    onClick: () => void;
    onDelete: () => void;
    onAddToReserved: () => void;
    onUpdate: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isSelected, onClick, onDelete, onAddToReserved, onUpdate }) => {
    return (
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
                    <div className="ml-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger >
                                <SlOptions className="h-4 w-4 mr-1" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className=" shadow-md rounded-lg">
                                <DropdownMenuItem className="hover:bg-gray-50 focus:outline-none" onClick={onUpdate}>
                                    Edit Property
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-50 focus:outline-none" onClick={onAddToReserved}>
                                    Add to Reserved
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-50 focus:outline-none" onClick={onDelete}>
                                    Delete Property
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
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
    );
};
