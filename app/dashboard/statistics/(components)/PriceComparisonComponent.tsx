'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { PropertyInfo } from '@/hooks/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PriceComparisonComponentProps {
    properties: PropertyInfo[];
}

const PriceComparisonComponent: React.FC<PriceComparisonComponentProps> = ({ properties }) => {
    const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

    const handlePropertySelect = (propertyId: string) => {
        if (selectedProperties.includes(propertyId)) {
            setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
        } else if (selectedProperties.length < 5) {
            setSelectedProperties([...selectedProperties, propertyId]);
        }
    };

    const comparisonData = selectedProperties.map(id =>
        properties.find(p => p.id.toString() === id)
    ).filter((p): p is PropertyInfo => p !== undefined);

    const getLatestPrice = (priceHistory: { price: number; time?: string }[] | undefined) => {
        return priceHistory && priceHistory.length > 0
            ? priceHistory.sort((a, b) => (a.time && b.time) ? new Date(b.time).getTime() - new Date(a.time).getTime() : 0)[0].price
            : 0;
    };

    const chartData = comparisonData.map(property => {
        const latestPrice = getLatestPrice(property.priceHistory);
        return {
            name: `Property ${property.id}`,
            price: latestPrice,
            pricePerSqm: latestPrice / property.sqm,
            area: property.sqm,
        };
    });

    const radarChartData = comparisonData.map(property => {
        const latestPrice = getLatestPrice(property.priceHistory);
        return {
            subject: `Property ${property.id}`,
            price: latestPrice / 1000, // Normalize to thousands for better visualization
            pricePerSqm: latestPrice / property.sqm,
            area: property.sqm / 100, // Normalize to hundreds for better visualization
        };
    });

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Comprehensive Price Comparison</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Select onValueChange={handlePropertySelect}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a property (up to 5)" />
                        </SelectTrigger>
                        <SelectContent>
                            {properties.map(property => (
                                <SelectItem key={property.id} value={property.id.toString()}>
                                    Property ID: {property.id}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {chartData.length > 0 ? (
                    <>
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Price and Area Comparison</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="price" fill="#8884d8" name="Total Price (₱)" />
                                    <Bar yAxisId="right" dataKey="pricePerSqm" fill="#82ca9d" name="Price per sqm (₱/sqm)" />
                                    <Bar yAxisId="right" dataKey="area" fill="#ffc658" name="Area (sqm)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {chartData.length > 2 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Property Attributes Comparison</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <RadarChart data={radarChartData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" />
                                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                                        <Radar name="Price (thousands ₱)" dataKey="price" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                        <Radar name="Price per sqm (₱/sqm)" dataKey="pricePerSqm" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                        <Radar name="Area (hundreds sqm)" dataKey="area" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Detailed Comparison Table</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Total Price (₱)</TableHead>
                                        <TableHead>Price per sqm (₱/sqm)</TableHead>
                                        <TableHead>Area (sqm)</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {comparisonData.map(property => {
                                        const latestPrice = getLatestPrice(property.priceHistory);
                                        return (
                                            <TableRow key={property.id}>
                                                <TableCell>Property {property.id}</TableCell>
                                                <TableCell>{latestPrice.toFixed(2)}</TableCell>
                                                <TableCell>{(latestPrice / property.sqm).toFixed(2)}</TableCell>
                                                <TableCell>{property.sqm}</TableCell>
                                                <TableCell>{property.status || 'Unknown'}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500">
                        Select properties to compare their prices and attributes.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PriceComparisonComponent;