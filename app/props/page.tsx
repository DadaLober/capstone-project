'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, TrendingUp } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Component() {
    return (
        <div className="flex flex-col gap-8 p-6 md:p-8 bg-gradient-to-br from-emerald-50 to-teal-100 min-h-screen">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-800">Agent Performance</h1>
                    <p className="text-emerald-600">Track your real estate sales and metrics</p>
                </div>
                <Select defaultValue="thisMonth">
                    <SelectTrigger className="w-[180px] bg-white bg-opacity-50 backdrop-blur-sm border-emerald-200">
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
            <Card className="bg-white bg-opacity-60 backdrop-blur-sm border-emerald-200 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-emerald-800">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-6 rounded-xl text-white">
                        <div className="flex items-center mb-2">
                            <Home className="h-6 w-6 mr-2" />
                            <span className="font-medium text-lg">Properties Sold</span>
                        </div>
                        <span className="text-4xl font-bold">8</span>
                        <p className="text-sm mt-2 text-emerald-100">+2 from last month</p>
                    </div>
                    <div className="bg-gradient-to-br from-teal-400 to-emerald-500 p-6 rounded-xl text-white">
                        <div className="flex items-center mb-2">
                            <TrendingUp className="h-6 w-6 mr-2" />
                            <span className="font-medium text-lg">Estimated Sales</span>
                        </div>
                        <span className="text-4xl font-bold">₱4.2M</span>
                        <p className="text-sm mt-2 text-emerald-100">+20.1% from last month</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-white bg-opacity-60 backdrop-blur-sm border-emerald-200 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-emerald-800">Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { name: "Acropolis North Property", price: "₱1.2M", date: "2 days ago" },
                            { name: "Hermes Residence", price: "₱980K", date: "1 week ago" },
                            { name: "Sumacab Sur Villa", price: "₱1.5M", date: "2 weeks ago" },
                        ].map((sale, index) => (
                            <div key={index} className="flex items-center gap-4 bg-white bg-opacity-70 p-4 rounded-lg shadow transition-all hover:shadow-md hover:bg-opacity-100">
                                <div className="size-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                    <Home className="h-6 w-6 text-white" />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <p className="text-sm font-medium text-emerald-800">{sale.name}</p>
                                    <p className="text-xs text-emerald-600">Sold for {sale.price}</p>
                                </div>
                                <div className="text-xs text-emerald-500">
                                    {sale.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}   