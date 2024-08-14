'use client';

import React from 'react';
import axios from 'axios';
import { useForm, type FieldValues } from "react-hook-form";

interface TypeForm {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    password: string;
}

export default function Register() {
    const { register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        getValues
    } = useForm<TypeForm>();

    const onSubmit = async (data: FieldValues) => {
        console.log('Form submitted:', data);
        try {
            const response = await axios.post('/api/register', data);
            const responseData = response.data;
            console.log('Server response:', responseData);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
            <input
                {...register("firstName", {
                    required: "First Name is required",
                })}
                type="text"
                placeholder="First Name"
                className="px-4 py-2 rounded"
            />
            <input
                {...register("lastName", {
                    required: "Last Name is required",
                })}
                type="text"
                placeholder="Last Name"
                className="px-4 py-2 rounded"
            />
            <input
                {...register("contactNumber", {
                    required: "Contact Number is required",
                })}
                type="text"
                placeholder="Contact No."
                className="px-4 py-2 rounded"
            />
            <input
                {...register("email", {
                    required: "Email is required",
                })}
                type="email"
                placeholder="Email"
                className="px-4 py-2 rounded"
            />
            <input
                {...register("password", {
                    required: "Password is required",
                })}
                type="password"
                placeholder="Password"
                className="px-4 py-2 rounded"
            />
            <button
                disabled={isSubmitting}
                type="submit"
                className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
            >
                Register
            </button>
        </form>
    );
}