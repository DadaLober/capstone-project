'use client';
import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import "@/app/login/login.css";
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

type TypeForm = {
    email: string;
    password: string;
};

export default function Login() {

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<TypeForm>();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: TypeForm) => {
        try {
            const response = await axios.post('/api/login', data);
            const responseData = response.data;
            console.log('Server response:', responseData);

            if (response.status === 200) {
                router.push('/dashboard');
            }
        } catch (errors: any) {
            if (errors.response.status === 400 || errors.response.status === 401) {
                setError('password', { message: 'Invalid email or password' });
            }
            else {
                console.error('Error submitting form:', errors);
            }
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <div className='svg-login-background w-full min-h-screen flex flex-col justify-center items-center p-4'>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 w-full max-w-md bg-white p-6 rounded-lg shadow-lg border">
                <div className='flex justify-center mb-4'>
                    <Image
                        src="/login.png"
                        alt="Logo"
                        width={64}
                        height={64}
                        className='w-16 h-16'
                    />
                </div>
                <input
                    {...register("email", {
                        required: "Email is required",
                    })}
                    type="email"
                    placeholder="Email"
                    className="px-4 py-2 my-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.email && <div className="text-red-500">{errors.email.message}</div>}
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
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="bg-green-500 text-slate-100 disabled:bg-gray-500 py-2 rounded hover:bg-green-700"
                >
                    {isSubmitting ? (
                        <span>
                            Submitting...
                        </span>
                    ) : (
                        'Submit'
                    )}
                </Button>
            </form>
            <div className='text-center mt-4'>
                <p className='text-slate-100'>New here? <Link href="/register" className='text-blue-600 hover:underline'>Create an Account</Link></p>
            </div>
        </div>
    );


}
