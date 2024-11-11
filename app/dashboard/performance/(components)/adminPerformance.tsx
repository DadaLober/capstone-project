'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProperties } from "@/hooks/useProperties"
import { useReservations } from "@/hooks/useReservations"
import { useState, useEffect } from "react"
import axios from "axios"
import { UserInfo } from "@/hooks/types"
import { BarChart, Users, TrendingUp } from "lucide-react"
import { calculateAgentPerformance, formatCurrency } from "../../../../hooks/analytics"

export default function AdminPerformance() {
    const { allProperties } = useProperties();
    const { getAllReserved } = useReservations();
    const [selectedPeriod, setSelectedPeriod] = useState<'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear'>('thisMonth');
    const [agents, setAgents] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
                console.log(response.data);
                setAgents(response.data);
            } catch (error) {
                console.error('Failed to fetch agents:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const agentMetrics = allProperties.data && getAllReserved.data && agents.length > 0
        ? calculateAgentPerformance(agents, allProperties.data, getAllReserved.data, selectedPeriod)
        : [];

    const totalSales = agentMetrics.reduce((sum, agent) => sum + agent.totalSalesValue, 0);
    const totalProperties = agentMetrics.reduce((sum, agent) => sum + agent.propertiesSold, 0);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-8 p-6 md:p-8 min-h-screen">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Agents Performance Dashboard
                    </h1>
                </div>
                <Select
                    value={selectedPeriod}
                    onValueChange={(value: 'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear') => setSelectedPeriod(value)}
                >
                    <SelectTrigger className="w-[180px] bg-background bg-opacity-50 backdrop-blur-sm">
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

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-card bg-opacity-60 backdrop-blur-sm bg-gradient-to-br from-slate-200 to-green-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground text-black">Total Sales Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black">{formatCurrency(totalSales)}</div>
                    </CardContent>
                </Card>

                <Card className="bg-card bg-opacity-60 backdrop-blur-sm bg-gradient-to-br from-slate-200 to-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground text-black">Properties Sold</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black">{totalProperties}</div>
                    </CardContent>
                </Card>

                <Card className="bg-card bg-opacity-60 backdrop-blur-sm bg-gradient-to-br from-slate-200 to-indigo-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground text-black">Active Agents</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black">{agents.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-card bg-opacity-60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Top Performing Agents</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {agentMetrics.sort((a, b) => b.propertiesSold - a.propertiesSold).map((agent, index) => (
                            <div key={agent.id} className="bg-background bg-opacity-70 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-card-foreground font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{agent.name}</h3>
                                            <p className="text-sm text-muted-foreground">{agent.propertiesSold} properties sold in total</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatCurrency(agent.totalSalesValue)}</p>
                                        <p className={`text-sm ${agent.performanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {agent.performanceChange >= 0 ? '↑' : '↓'} {Math.abs(agent.performanceChange).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {agent.recentSales.map((sale, saleIndex) => (
                                        <div key={saleIndex} className="bg-muted p-3 rounded-md">
                                            <p className="text-sm font-medium truncate">{sale.propertyName}</p>
                                            <p className="text-sm text-muted-foreground">{formatCurrency(sale.price)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
