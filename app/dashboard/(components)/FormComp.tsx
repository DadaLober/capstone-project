// components/MarkerForm.tsx
import React from 'react';
import { useState , ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
interface MarkerFormProps {
  selectedPosition: { lat: number; lng: number } | null;
  Address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}

const FormComp: React.FC<MarkerFormProps> = ({ selectedPosition, Address, setAddress }) => {

    const [additionalFields, setAdditionalFields] = useState<number[]>([0]);
    const handleLocationNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    const addField = () => {
    setAdditionalFields((prevFields) => [...prevFields, prevFields.length]);
    };
    return (
        <div className="w-full bg-white p-4 shadow-md">
        <h3 className="font-bold mb-2">Selected Position</h3>
        <input
            type="text"
            className="w-full mb-2 p-2 border rounded"
            placeholder="Address"
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
        />
        <input
            type="text"
            className="w-full mb-2 p-2 border rounded"
            placeholder="Latitude"
            value={selectedPosition ? selectedPosition.lat.toFixed(5) : ''}
            readOnly
        />
        <input
            type="text"
            className="w-full mb-2 p-2 border rounded"
            placeholder="Longitude"
            value={selectedPosition ? selectedPosition.lng.toFixed(5) : ''}
            readOnly
        />
        <input
            type="text"
            className="w-full mb-2 p-2 border rounded"
            placeholder="Size / sqm"
            
        />
        <input
            type="text"
            className="w-full mb-2 p-2 border rounded"
            placeholder="Price"
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
        />
        
        {additionalFields.map((_, index) => (
            <div key={index} className="mb-2">
                <label htmlFor={`field-${index}`}>Other Attributes: {index + 1}</label>
                <input type="text" id={`field-${index}`} className="w-full mb-2 p-2 border rounded" />
            </div>
        ))}
        <Button type="button" onClick={addField} className="mt-2 bg-green-500 hover:bg-green-700" name="Add Field"> Add Field</Button>
           
        
    </div>
    );
};

export default FormComp;
