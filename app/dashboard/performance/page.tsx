'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import axios from "axios"
import { UserInfo } from "@/hooks/types"
import UserPerformance from "../../dashboard/performance/(components)/UserPerformance"
import AdminPerformance from "../../dashboard/performance/(components)/adminPerformance"
import Header from "../(components)/header"

export default function DashboardPage() {
    const [agents, setAgents] = useState<UserInfo[]>([]);
    const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [agentsResponse, userResponse] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`)
                ]);
                setAgents(agentsResponse.data);
                setCurrentUser(userResponse.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <>
            <Header />
            <div className="p-6 md:p-8 min-h-screen">
                <Tabs defaultValue="personal" className="space-y-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <TabsList className="mt-2">
                                <TabsTrigger value="personal">Personal Performance</TabsTrigger>
                                <TabsTrigger value="team">Team Overview</TabsTrigger>
                            </TabsList>
                        </div>
                    </div>

                    <TabsContent value="personal">
                        <UserPerformance />
                    </TabsContent>

                    <TabsContent value="team">
                        <AdminPerformance />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
