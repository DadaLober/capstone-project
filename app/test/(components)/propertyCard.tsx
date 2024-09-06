'use client'

import { Card, CardContent } from '@/components/ui/card';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { PropertyInfo } from '../(hooks)/types';

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
                <h2 className="text-base font-semibold mb-2">{property.address}</h2>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-red-500" size={14} />
                        <p className="text-xs text-gray-600">
                            {property.location ? `${property.location.lng}, ${property.location.lat}` : 'Location not available'}
                        </p>
                    </div>
                    <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-green-500" size={14} />
                        <p className="text-xs text-gray-600">Status: {property.status || 'Not Available'}</p>
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
