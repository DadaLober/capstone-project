import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { PropertyInfo } from '@/hooks/types';

interface SquareMetersInputProps {
    register: UseFormRegister<PropertyInfo>;
    errors: FieldErrors<PropertyInfo>;
}

function SquareMetersInput({ register, errors }: SquareMetersInputProps) {
    return (
        <div className="flex flex-col space-y-2">
            <Input
                type="number"
                placeholder="Square meters"
                {...register("sqm", {
                    required: "Square meter is required",
                    pattern: {
                        value: /^[1-9]\d*$/,
                        message: "Square meter must be a positive number greater than 0"
                    }
                })}
            />
            {errors.sqm && <p className="text-red-500 text-sm">{errors.sqm.message}</p>}
        </div>
    );
}

export default SquareMetersInput;