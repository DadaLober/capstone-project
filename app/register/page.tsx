'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useForm, type FieldValues } from "react-hook-form";
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '@/app/register/register.css';

type TypeForm = {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    password: string;
}

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<TypeForm>();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: FieldValues) => {
        console.log('Form submitted:', data);
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
                <img src="./map2.svg" alt="" className='w-32 h-32 ' />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 w-full max-w-md bg-white p-10 rounded-lg border shadow-lg">
                {/* <div className='flex justify-center mb-4'>
                    <img src="/logo.png" alt="Logo" className='w-20 h-20' />
                </div> */}
                <div className="flex gap-x-4">
                    <input
                        {...register("firstName", {
                            required: "First Name required",
                        })}
                        type="text"
                        placeholder="First Name"
                        className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                    )}
                    <input
                        {...register("lastName", {
                            required: "Last Name required",
                        })}
                        type="text"
                        placeholder="Last Name"
                        className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                    )}
                </div>
                {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )}
                <input
                    {...register("contactNumber", {
                        required: "Contact Number is required",
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
                        required: "Email is required",
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
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                            },
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
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="bg-green-500 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                    {isSubmitting ? 'Submitting...' : 'Register'}
                </button>

                <div className='mt-4 text-center'>
                    <p className="text-sm">Already have an account? <Link href='/login' className='text-blue-500 hover:underline'>Login</Link></p>
                </div>
            </form>
        </div>
    );
}
