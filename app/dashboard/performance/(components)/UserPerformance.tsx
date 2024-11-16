'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, TrendingUp } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useProperties } from "@/hooks/useProperties"
import { useReservations } from "@/hooks/useReservations"
import { useState, useEffect } from "react"
import axios from "axios"
import { UserInfo } from "@/hooks/types"
import { calculatePerformanceMetrics, formatCurrency } from "../../../../hooks/analytics"

export default function UserPerformance() {
    const { allProperties } = useProperties();
    const { getAllReserved } = useReservations();
    const [selectedPeriod, setSelectedPeriod] = useState<'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear'>('thisMonth');
    const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`);
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchUser();
    }, []);

    const metrics = allProperties.data && getAllReserved.data && currentUser
        ? calculatePerformanceMetrics(allProperties.data, getAllReserved.data, currentUser, selectedPeriod)
        : null;

    if (!currentUser) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-8 p-6 md:p-8 min-h-screen">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {currentUser.firstName} Performance
                    </h1>
                </div>
                <Select
                    value={selectedPeriod}
                    onValueChange={(value: 'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear') => setSelectedPeriod(value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="thisWeek">This Week</SelectItem>
                        <SelectItem value="thisMonth">This Month</SelectItem>
                        <SelectItem value="thisQuarter">This Quarter</SelectItem>
                        <SelectItem value="thisYear">This Year</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-slate-200 to-green-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-black">Properties Sold</CardTitle>
                        <BarChart className="h-4 w-4 text-black" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black">{metrics?.propertiesSold || 0}</div>
                        <p className={`text-sm mt-1 ${metrics && metrics.percentageChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics && metrics.percentageChange > 0 ? '↑' : '↓'} {metrics ? Math.abs(metrics.percentageChange).toFixed(1) : 0}% from last period
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-200 to-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-black">Estimated Sales</CardTitle>
                        <TrendingUp className="h-4 w-4 text-black" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black">
                            {metrics ? formatCurrency(metrics.estimatedSales) : '₱0'}
                        </div>
                        <p className={`text-sm mt-1 ${metrics && metrics.percentageChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics && metrics.percentageChange > 0 ? '↑' : '↓'} {metrics ? Math.abs(metrics.percentageChange).toFixed(1) : 0}% from last period
                        </p>

                    </CardContent>
                </Card>

            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {metrics?.recentSales.length === 0 ? (
                            <div className="text-center py-4">
                                No sales recorded in this period
                            </div>
                        ) : (
                            metrics?.recentSales.map((sale, index) => (
                                <div key={index} className="p-4 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                                            <BarChart className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">{sale.name}</p>
                                            <p className="text-sm">{formatCurrency(sale.price)}</p>
                                        </div>
                                        <div className="text-sm">
                                            {sale.timeAgo}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}