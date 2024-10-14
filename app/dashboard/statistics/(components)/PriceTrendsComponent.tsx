import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PropertyInfo } from '@/hooks/types';

interface PriceTrendsComponentProps {
    properties: PropertyInfo[];
}

const PriceTrendsComponent: React.FC<PriceTrendsComponentProps> = ({ properties }) => {
    const [selectedProperty, setSelectedProperty] = useState<string>('all');

    const getPriceHistory = (property: PropertyInfo) => {
        return property.priceHistory?.map(history => ({
            date: new Date(history.time),
            price: history.price
        }))
            ?.sort((a, b) => a.date.getTime() - b.date.getTime())
            ?.map(item => ({
                date: item.date.toLocaleDateString(),
                price: item.price
            })) ?? [];
    };

    const getAllPropertiesPriceHistory = () => {
        const allHistory: { [date: string]: { total: number; count: number } } = {};
        properties.forEach(property => {
            property.priceHistory?.forEach(history => {
                const date = new Date(history.time);
                const dateString = date.toLocaleDateString();
                if (!allHistory[dateString]) {
                    allHistory[dateString] = { total: 0, count: 0 };
                }
                allHistory[dateString].total += history.price;
                allHistory[dateString].count += 1;
            });
        });
        return Object.entries(allHistory)
            .map(([date, { total, count }]) => ({
                date: new Date(date),
                price: total / count // Average price
            }))
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map(item => ({
                date: item.date.toLocaleDateString(),
                price: Number(item.price.toFixed(2))
            }));
    };

    const chartData = selectedProperty === 'all'
        ? getAllPropertiesPriceHistory()
        : getPriceHistory(properties.find(p => p.id.toString() === selectedProperty)!);

    if (properties.length === 0) {
        return (
            <div className="text-center text-gray-500 p-4">
                No properties available to display price trends.
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Price Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a property" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Properties (Average)</SelectItem>
                            {properties.map(property => (
                                <SelectItem key={property.id} value={property.id.toString()}>
                                    Property ID: {property.id}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                                interval={0}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center text-gray-500">
                        No price history available for the selected property.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PriceTrendsComponent;