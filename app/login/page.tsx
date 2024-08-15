'use client';
import React from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import "./login.css";

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
        <div className='svg-background w-full min-h-screen flex flex-col justify-center items-center p-4'>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 w-full max-w-md bg-slate-100 p-6 rounded-lg shadow-lg">
                <div className='flex justify-center mb-4'>
                    <img src="/login.png" alt="Logo" className='w-16 h-16' />
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
                <input 
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Password must be at least 8 characters" },
                    })}
                    type="password"
                    placeholder="Password"
                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                <button
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
                </button>
            </form>
            <div className='text-center my-8 border border-slate-100 w-full max-w-md bg-transparent p-6'>
                <p className='text-slate-100'>New here? <span className='text-purple-700'>Create an Account</span></p>
            </div>

            <div className='my-8'>
                <p className='text-slate-100'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </div>
        </div>
    );
    
    
}
