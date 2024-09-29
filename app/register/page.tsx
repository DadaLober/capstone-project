'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useForm, type FieldValues } from "react-hook-form";
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';

import '@/app/register/register.css';
import { Button } from '@/components/ui/button';


interface FormData {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    password: string;
}
export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: FieldValues) => {
        try {
            const response = await axios.post('/api/register', data);
            const responseData = response.data;
            console.log('Server response:', responseData);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <div className='svg-register-background relative w-full min-h-screen flex flex-col justify-center items-center p-4'>
            <div className='absolute top-0  '>
                <Image
                    src="/register.png"
                    alt="Logo"
                    width={64}
                    height={64}
                    className='w-16 h-16'
                />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 w-full max-w-md bg-white p-10 rounded-lg border shadow-lg">
                <div className="flex gap-x-4">
                    <input
                        {...register("firstName", { required: "First Name is required" })}
                        type="text"
                        placeholder="First Name"
                        className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                    )}
                    <input
                        {...register("lastName", { required: "Last Name is required" })}
                        type="text"
                        placeholder="Last Name"
                        className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                    )}
                </div>
                <input
                    {...register("contactNumber", {
                        pattern: /^\d{11}$/,
                        required: "Contact Number must be 11 digits",
                    })}
                    type="text"
                    placeholder="Contact Number"
                    className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.contactNumber && (
                    <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>
                )}
                <input
                    {...register("email", {
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        required: "Email is required"
                    })}
                    type="email"
                    placeholder="Email"
                    className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                <div className="relative">
                    <input
                        {...register("password", {
                            minLength: 8,
                            required: "Password must be at least 8 characters",
                        })}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="px-4 py-2 rounded border w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <span
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-sm">Password must be at least 8 characters</p>
                )}
                <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="bg-green-500 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                    {isSubmitting ? 'Submitting...' : 'Register'}
                </Button>

                <div className='mt-4 text-center'>
                    <p className="text-sm">Already have an account? <Link href='/login' className='text-blue-500 hover:underline'>Login</Link></p>
                </div>
            </form>
        </div>
    );
}
