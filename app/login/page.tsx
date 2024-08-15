'use client';
import React from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";

interface TypeForm {
    email: string;
    password: string;
}

export default function Login() {

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<TypeForm>();

    const onSubmit = async (data: TypeForm) => {
        try {
            const response = await axios.post('/api/login', data);
            const responseData = response.data;
            console.log('Server response:', responseData);
            // Handle successful login (e.g., redirect) TODO
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setError('password', { message: 'Invalid email or password' });
            } else {
                console.error('Error submitting form:', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
            <input
                {...register("email", {
                    required: "Email is required",
                })}
                type="email"
                placeholder="Email"
                className="px-4 py-2 rounded"
            />
            {errors.email && <div className="text-red-500">{errors.email.message}</div>}
            <input
                {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
                type="password"
                placeholder="Password"
                className="px-4 py-2 rounded"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            <button
                disabled={isSubmitting}
                type="submit"
                className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
            >
                {isSubmitting ? (
                    <span>
                        Submitting...  {/* Spinner  TODO */}
                    </span>
                ) : (
                    'Submit'
                )}
            </button>
        </form>
    );
}
