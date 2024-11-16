'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import Modal from './Modal'
import { useUserInfo } from '@/hooks/useUserInfo'

interface UserSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserSettings {
    firstName: string
    lastName: string
    contactNumber: string
    email: string
    status: string
    role: string
}

export default function UserSettingsModal({ isOpen, onClose }: UserSettingsModalProps) {
    const { userInfo } = useUserInfo();
    const [settings, setSettings] = useState<UserSettings>({
        firstName: userInfo?.firstName || "",
        lastName: userInfo?.lastName || "",
        contactNumber: userInfo?.contactNumber || "",
        email: userInfo?.email || "",
        status: userInfo?.status || "",
        role: userInfo?.role || ""
    })

    useEffect(() => {
        if (userInfo) {
            setSettings({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                contactNumber: userInfo.contactNumber,
                email: userInfo.email,
                status: userInfo.status,
                role: userInfo.role
            });
        }
    }, [userInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Updated settings:', settings)
        toast.success('Settings updated', {
            description: 'Your settings have been updated successfully.'
        })
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>User Settings</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={settings.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={settings.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactNumber">Contact Number</Label>
                                    <Input
                                        id="contactNumber"
                                        name="contactNumber"
                                        value={settings.contactNumber}
                                        onChange={handleChange}
                                        type="tel"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        value={settings.email}
                                        onChange={handleChange}
                                        type="email"
                                        required
                                        readOnly
                                        className="bg-gray-100"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">Save Changes</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </Modal>
    )
}
