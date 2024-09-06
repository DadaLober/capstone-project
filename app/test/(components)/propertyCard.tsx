'use client'

import { FaMapMarkerAlt, FaAddressBook } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyInfo } from '@/app/test/(hooks)/types';

interface PropertyCardProps {
    property: PropertyInfo;
    isSelected: boolean;
    onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isSelected, onClick }) => {
    return (
        <Card
            className={`mb-4 ${isSelected ? 'border border-blue-500' : ''} hover:shadow-md transition-all duration-300`}
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex items-center mb-2">
                    <FaAddressBook className="mr-2 text-green-500" size={18} />
                    <h2 className="text-base font-semibold">{property.address}</h2>
                </div>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-red-500" size={14} />
                        <p className="text-xs text-gray-600">
                            {property.location ? `${property.location.lng}, ${property.location.lat}` : 'Location not available'}
                        </p>
                    </div>
                </div>
                <div className="flex justify-between items-end mb-2">
                    <p className="text-base font-medium">${property.priceHistory?.[0]?.price || 'Price not available'}</p>
                    <p className="text-xs text-gray-500">{property.sqm} m²</p>
                </div>
            </CardContent>
        </Card>
    );
};
