import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { Input } from '@/components/ui/input';
import { PropertyInfo } from '@/app/dashboard/(hooks)/types';


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
                <h3 className="text-lg font-bold">Price History</h3>
                <button
                    type="button"
                    onClick={() => append({ price: 0, time: new Date().toISOString() })}
                    className="ml-auto"
                >
                    <MdOutlineAddCircleOutline />
                </button>
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
                        <Input
                            type="datetime-local"
                            placeholder="Time"
                            className="w-auto"
                            {...register(`priceHistory.${index}.time` as const, {
                                required: "Time is required",
                                validate: value => {
                                    const selectedTime = new Date(value);
                                    const currentTime = new Date();
                                    return selectedTime <= currentTime || "Time cannot be in the future";
                                }
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
                    {errors.priceHistory?.[index]?.time && (
                        <p className="text-red-500 text-sm">Time: {errors.priceHistory[index].time?.message}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default PriceHistoryInputs;