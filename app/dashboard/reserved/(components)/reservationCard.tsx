'use client'

import { FaMapMarkerAlt, FaAddressBook } from 'react-icons/fa';
import { SlOptions } from "react-icons/sl";
import { Card, CardContent } from '@/components/ui/card';
import { Reservations } from '@/app/dashboard/(hooks)/types';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface PropertyCardProps {
    property: Reservations;
    isSelected: boolean;
    onClick: () => void;
    onDelete: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isSelected, onClick, onDelete }) => {
    return (
        <Card
            className={`mb-4 ${isSelected ? 'border border-blue-500' : ''} hover:shadow-md transition-all duration-300 hover:cursor-pointer`}
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex items-center mb-2">
                    <FaAddressBook className="mr-2 text-green-500" size={18} />
                    <h2 className="text-base font-semibold">{property.propertyInfo[0].address}</h2>
                    <div className="ml-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger >
                                <SlOptions className="h-4 w-4 mr-1" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white shadow-md rounded-lg">
                                <DropdownMenuItem className="hover:bg-gray-50 focus:outline-none">
                                    Edit Property
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-50 focus:outline-none">
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
                            {property.propertyInfo[0].location ? `${property.propertyInfo[0].location.lng}, ${property.propertyInfo[0].location.lat}` : 'Location not available'}
                        </p>
                    </div>
                </div>
                <div className="flex justify-between items-end mb-2">
                    <p>Fee:{property.fee}</p>
                    <p className="text-xs text-gray-500">{property.propertyInfo[0].sqm} m²</p>
                </div>
            </CardContent>
        </Card>
    );
};
