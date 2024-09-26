import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PiMagicWand } from "react-icons/pi";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PropertyInfo } from '@/app/dashboard/(hooks)/types';

interface AddressInputProps {
    register: UseFormRegister<PropertyInfo>;
    errors: FieldErrors<PropertyInfo>;
    generateAddress: () => Promise<void>;
}

function AddressInput({ register, errors, generateAddress }: AddressInputProps) {
    return (
        <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
                <Input
                    type="text"
                    placeholder="Address"
                    {...register('address', {
                        required: "Address is required",
                    })}
                    className="flex-grow"
                />
                <Button type="button" onClick={generateAddress} className="ml-3" variant="secondary">
                    <PiMagicWand />
                </Button>
            </div>
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>
    );
}

export default AddressInput;