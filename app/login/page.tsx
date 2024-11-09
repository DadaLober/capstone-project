'use client';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useForm } from "react-hook-form";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import "@/components/auth.css";
import { motion } from 'framer-motion';

type TypeForm = {
    email: string;
    password: string;
};

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

export default function Login() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<TypeForm>();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: TypeForm) => {
        try {
            const response = await axios.post('/api/login', data);
            if (response.status === 200) {
                router.push('/dashboard');
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 400) {
                    setError('password', { message: 'Invalid email or password' });
                }
                if (error.response.data.message !== undefined) {
                    console.error(error.response.data.message);
                }
            }
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
                            src="/login.png"
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
                        Welcome Back
                    </motion.h1>
                    <motion.p
                        className="text-green-600"
                        variants={itemVariants}
                    >
                        Sign in to your account
                    </motion.p>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-green-100"
                    variants={itemVariants}
                >
                    <motion.div
                        className="mb-6"
                        variants={itemVariants}
                    >
                        <label className="block text-sm font-medium text-green-700 mb-1">Email</label>
                        <motion.input
                            {...register("email", {
                                required: "Email is required",
                            })}
                            type="email"
                            className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
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

                    <motion.button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </motion.button>

                    <motion.div
                        className="mt-6 text-center"
                        variants={itemVariants}
                    >
                        <p className="text-green-800">
                            Dont have an account?{' '}
                            <motion.span whileHover={{ scale: 1.05 }}>
                                <Link href="/register" className="text-green-600 hover:text-green-800 font-semibold">
                                    Create Account
                                </Link>
                            </motion.span>
                        </p>
                    </motion.div>
                </motion.form>
            </motion.div>
        </motion.div>
    );
}