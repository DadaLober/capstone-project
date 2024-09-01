'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useForm, type FieldValues } from "react-hook-form";
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '@/app/register/register.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    contactNumber: z.string().regex(/^\d{11}$/i, { message: "Contact Number must be 11 digits" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, "Password must be at least 8 characters")
});

type TypeForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<TypeForm>({
        resolver: zodResolver(registerSchema),
    });
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: TypeForm) => {
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
                <div className="flex gap-x-4">
                    <input
                        {...register("firstName")}
                        type="text"
                        placeholder="First Name"
                        className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                    )}
                    <input
                        {...register("lastName")}
                        type="text"
                        placeholder="Last Name"
                        className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                    )}
                </div>
                <input
                    {...register("contactNumber")}
                    type="text"
                    placeholder="Contact Number"
                    className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.contactNumber && (
                    <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>
                )}
                <input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                    className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                <div className="relative">
                    <input
                        {...register("password")}
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
