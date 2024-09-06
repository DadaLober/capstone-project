'use client'

import { Marker, Popup } from 'react-leaflet';
import { Button } from "@/components/ui/button";
import { PropertyInfo, customIcon } from '@/app/test/(hooks)/types';

interface LocationMarkerProps {
    propertyInfo: PropertyInfo | null;
    handleViewAdditionalProperties: () => void;
}

const PropertyMarker: React.FC<LocationMarkerProps> = ({ propertyInfo, handleViewAdditionalProperties }) => {
    if (!propertyInfo) return null;

    return (
        <Marker position={[propertyInfo.location.lat, propertyInfo.location.lng]} icon={customIcon}>
            <Popup className="bg-white rounded-lg shadow-lg p-4 w-96 flex flex-col items-stretch">
                <h3 className="text-xl font-bold mb-4 text-blue-600">{propertyInfo.address}</h3>
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                        <span className="font-bold">Status:</span>
                        <span>{propertyInfo.status || 'Not Available'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold">Sqm:</span>
                        <span>{propertyInfo.sqm} m²</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold">Price:</span>
                        <span>{propertyInfo.priceHistory?.[0]?.price || 'Price not available'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold">Created At:</span>
                        <span>{new Date(propertyInfo.createdAt).toLocaleString()}</span>
                    </div>
                    <Button
                        variant="default"
                        className="mt-4"
                        onClick={handleViewAdditionalProperties}
                    >
                        View Additional Properties
                    </Button>
                </div>
            </Popup>
        </Marker>
    );
};

export default PropertyMarker