import React from 'react';
import { PropertyInfo } from '@/hooks/types';

interface PropertyCardProps {
    property: PropertyInfo;
    isSelected: boolean;
    onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isSelected, onClick }) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'reserved':
                return 'text-yellow-600';
            case 'active':
                return 'text-green-600';
            case 'sold':
                return 'text-red-600';
            case 'cancelled':
            case 'canceled':
                return 'text-gray-600';
            case 'expired':
                return 'text-orange-600';
            default:
                return 'text-blue-600';
        }
    };

    const latestPrice = property.priceHistory && property.priceHistory.length > 0
        ? property.priceHistory[property.priceHistory.length - 1].price
        : null;

    return (
        <div
            className={`border-green-500 p-4 mb-4 cursor-pointer ${isSelected ? 'border-2 border-blue-500' : ''
                }`}
            onClick={onClick}
        >
            <h3 className="text-lg font-semibold mb-2">{property.address}</h3>
            <p className="text-sm text-gray-600 mb-1">Size: {property.sqm} sqm</p>
            <p className="text-sm text-gray-600 mb-1">
                Location: {property.location.name || `${property.location.lat.toFixed(6)}, ${property.location.lng.toFixed(6)}`}
            </p>
            <p className={`text-sm font-bold ${getStatusColor(property.status || '')}`}>
                Status: {property.status || 'Unknown'}
            </p>
            {latestPrice !== null && (
                <p className="text-sm text-gray-600 mt-2">
                    Current Price: ₱{latestPrice.toFixed(2)}
                </p>
            )}
        </div>
    );
};