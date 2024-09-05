// components/ui/form-field.tsx
import React from 'react';
import { Controller } from 'react-hook-form';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    type: 'text' | 'number';
    placeholder: string;
    control: any;
}

const FormField: React.FC<FormFieldProps> = ({
    name,
    type,
    placeholder,
    control,
}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <input
                    type={type}
                    {...field}
                    placeholder={placeholder}
                    className="block w-full p-2 rounded-lg border border-gray-300"
                />
            )}
        />
    );
};

export default FormField;