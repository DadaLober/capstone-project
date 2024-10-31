import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { Input } from '@/components/ui/input';
import { PropertyInfo } from '@/hooks/types';


function PriceHistoryInputs({ fields, register, errors, append, remove }: {
    fields: any[],
    register: UseFormRegister<PropertyInfo>,
    errors: FieldErrors<PropertyInfo>,
    append: (value: any) => void,
    remove: (index: number) => void
}) {
    const renderInputs = fields.length > 0 ? fields : [{ id: 'default', price: 0, time: new Date().toISOString() }];
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center mb-4">
                <h3 className="text-lg font-bold">Price</h3>
            </div>
            {renderInputs.map((item, index) => (
                <div key={item.id} className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                        <Input
                            type="number"
                            placeholder="Price"
                            className="flex-grow"
                            {...register(`priceHistory.${index}.price` as const, {
                                required: "Price is required",
                                min: {
                                    value: 0.01,
                                    message: "Price must be greater than 0"
                                },
                                valueAsNumber: true
                            })}
                        />
                        {fields.length > 1 && (
                            <button type="button" onClick={() => remove(index)} className="ml-auto">
                                <IoIosRemoveCircleOutline />
                            </button>
                        )}
                    </div>
                    {errors.priceHistory?.[index]?.price && (
                        <p className="text-red-500 text-sm">Price: {errors.priceHistory[index].price?.message}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default PriceHistoryInputs;