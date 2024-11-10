import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { PropertyInfo } from '@/hooks/types';

interface PriceInputProps {
    register: UseFormRegister<PropertyInfo>;
    errors: FieldErrors<PropertyInfo>;
    currentPrice?: number;
}

function PriceInput({ register, errors, currentPrice }: PriceInputProps) {
    return (
        <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold">Updated Price</h3>
            <div className="flex flex-col space-y-2">
                <Input
                    type="number"
                    placeholder={`Current Price: ${currentPrice || 0}`}
                    className="flex-grow"
                    {...register(`priceHistory.0.price`, {
                        required: "Price is required",
                        min: {
                            value: 0.01,
                            message: "Price must be greater than 0"
                        },
                        valueAsNumber: true
                    })}
                />
                {errors.priceHistory?.[0]?.price && (
                    <p className="text-red-500 text-sm">{errors.priceHistory[0].price?.message}</p>
                )}
                {currentPrice && (
                    <p className="text-sm text-gray-500">
                        Current Price: ₱{currentPrice}
                    </p>
                )}
            </div>
        </div>
    );
}

export default PriceInput;