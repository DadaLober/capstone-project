'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useForm } from "react-hook-form";
import Link from 'next/link';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from 'framer-motion';
import { toast } from 'sonner';


interface FormData {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    password: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 }
    }
};

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setError } = useForm<FormData>();
    const [showPassword, setShowPassword] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [showOtpInput, setShowOtpInput] = useState(false);

    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (!captchaToken) {
                toast.error("Please complete the CAPTCHA");
                return;
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
                ...data,
            });

            toast.success("Account created successfully!");
            reset();
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 400) {
                    setError("email", {
                        type: "manual",
                        message: "This email is already registered. Please use a different email."
                    });
                    toast.error("This email is already registered");
                    return;
                }
            }
            toast.error("An unexpected error occurred");
            console.error('Error:', error);
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="w-full max-w-md"
                variants={itemVariants}
            >
                <motion.div
                    className="mb-8 text-center"
                    variants={itemVariants}
                >
                    <motion.div
                        className="inline-block p-2 bg-white rounded-full shadow-lg mb-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={64}
                            height={64}
                            className="w-16 h-16"
                        />
                    </motion.div>
                    <motion.h1
                        className="text-3xl font-bold text-green-800 mb-2"
                        variants={itemVariants}
                    >
                        Create Account
                    </motion.h1>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-green-100"
                    variants={itemVariants}
                >
                    {errors.root && (
                        <motion.div
                            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {errors.root.message}
                        </motion.div>
                    )}

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                        variants={itemVariants}
                    >
                        <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">First Name</label>
                            <motion.input
                                {...register("firstName", { required: "First Name is required" })}
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="John"
                                whileFocus={{ scale: 1.01 }}
                            />
                            {errors.firstName && (
                                <motion.p
                                    className="mt-1 text-red-500 text-sm"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {errors.firstName.message}
                                </motion.p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Last Name</label>
                            <motion.input
                                {...register("lastName", { required: "Last Name is required" })}
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Doe"
                                whileFocus={{ scale: 1.01 }}
                            />
                            {errors.lastName && (
                                <motion.p
                                    className="mt-1 text-red-500 text-sm"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {errors.lastName.message}
                                </motion.p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        className="mb-6"
                        variants={itemVariants}
                    >
                        <label className="block text-sm font-medium text-green-700 mb-1">Contact Number</label>
                        <motion.input
                            {...register("contactNumber", {
                                pattern: {
                                    value: /^\d{11}$/,
                                    message: "Contact Number must be 11 digits"
                                },
                                required: "Contact Number is required"
                            })}
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="09123456789"
                            whileFocus={{ scale: 1.01 }}
                        />
                        {errors.contactNumber && (
                            <motion.p
                                className="mt-1 text-red-500 text-sm"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {errors.contactNumber.message}
                            </motion.p>
                        )}
                    </motion.div>

                    <motion.div
                        className="mb-6"
                        variants={itemVariants}
                    >
                        <label className="block text-sm font-medium text-green-700 mb-1">Email</label>
                        <motion.input
                            {...register("email", {
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Please enter a valid email address"
                                },
                                required: "Email is required"
                            })}
                            type="email"
                            className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-green-200'
                                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                            placeholder="john@example.com"
                            whileFocus={{ scale: 1.01 }}
                        />
                        {errors.email && (
                            <motion.p
                                className="mt-1 text-red-500 text-sm"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {errors.email.message}
                            </motion.p>
                        )}
                    </motion.div>

                    <motion.div
                        className="mb-6"
                        variants={itemVariants}
                    >
                        <label className="block text-sm font-medium text-green-700 mb-1">Password</label>
                        <div className="relative">
                            <motion.input
                                {...register("password", {
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters"
                                    },
                                    required: "Password is required"
                                })}
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="••••••••"
                                whileFocus={{ scale: 1.01 }}
                            />
                            <motion.button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800"
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </motion.button>
                        </div>
                        {errors.password && (
                            <motion.p
                                className="mt-1 text-red-500 text-sm"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {errors.password.message}
                            </motion.p>
                        )}
                    </motion.div>

                    <motion.div className="mb-6" variants={itemVariants}>
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                            onChange={handleCaptchaChange}
                        />
                    </motion.div>
                    <motion.button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-green-400"
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </motion.button>
                    <motion.div
                        className="mt-6 text-center"
                        variants={itemVariants}
                    >
                        <p className="text-green-800">
                            Already have an account?{' '}
                            <motion.span whileHover={{ scale: 1.05 }}>
                                <Link href="/login" className="text-green-600 hover:text-green-800 font-semibold">
                                    Sign In
                                </Link>
                            </motion.span>
                        </p>
                    </motion.div>
                </motion.form>
            </motion.div>
        </motion.div>
    );
}