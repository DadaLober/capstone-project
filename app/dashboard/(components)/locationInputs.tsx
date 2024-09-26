import React from 'react';
import { Location } from '@/app/dashboard/(hooks)/types';
import { Input } from '@/components/ui/input';

interface LocationInputsProps {
    currentLocation: Location;
}

const LocationInputs: React.FC<LocationInputsProps> = ({ currentLocation }) => {
    return (
        <div className="flex space-x-2">
            <Input
                type="number"
                value={currentLocation.lat}
                readOnly
                placeholder="Latitude"
                className="w-1/2 p-2 border rounded"
                disabled
            />
            <Input
                type="number"
                value={currentLocation.lng}
                readOnly
                placeholder="Longitude"
                className="w-1/2 p-2 border rounded"
                disabled
            />
        </div>
    );
};

export default LocationInputs;