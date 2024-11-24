import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PropertyInfo } from '@/hooks/types';

interface PriceTrendsComponentProps {
    properties: PropertyInfo[];
}

interface PriceDataPoint {
    date: string;
    price: number;
    percentageChange?: number;
    movingAverage?: number;
}

const PriceTrendsComponent: React.FC<PriceTrendsComponentProps> = ({ properties }) => {
    const [selectedProperty, setSelectedProperty] = useState<string>('all');
    const [trendType, setTrendType] = useState<'raw' | 'moving-average' | 'percentage-change'>('raw');

    const calculateMovingAverage = (prices: number[], window: number = 3): number[] => {
        return prices.map((_, index) => {
            const start = Math.max(0, index - window + 1);
            const windowPrices = prices.slice(start, index + 1);
            return Number((windowPrices.reduce((sum, price) => sum + price, 0) / windowPrices.length).toFixed(2));
        });
    };

    const calculatePercentageChanges = (prices: number[]): number[] => {
        return prices.map((price, index) => {
            if (index === 0) return 0;
            const previousPrice = prices[index - 1];
            return Number(((price - previousPrice) / previousPrice * 100).toFixed(2));
        });
    };

    const getPropertyPriceTrends = (property: PropertyInfo): PriceDataPoint[] => {
        if (!property.priceHistory?.length) return [];

        const sortedHistory = property.priceHistory
            .map(history => ({
                date: new Date(history.time ?? ''),
                price: history.price
            }))
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        const prices = sortedHistory.map(item => item.price);
        const movingAverages = calculateMovingAverage(prices);
        const percentageChanges = calculatePercentageChanges(prices);

        return sortedHistory.map((item, index) => ({
            date: item.date.toLocaleDateString(),
            price: item.price,
            movingAverage: movingAverages[index],
            percentageChange: percentageChanges[index]
        }));
    };

    const getMarketTrends = (): PriceDataPoint[] => {
        const marketData: { [date: string]: { prices: number[] } } = {};

        // Aggregate all property prices by date
        properties.forEach(property => {
            property.priceHistory?.forEach(history => {
                const dateStr = new Date(history.time ?? '').toLocaleDateString();
                if (!marketData[dateStr]) {
                    marketData[dateStr] = { prices: [] };
                }
                marketData[dateStr].prices.push(history.price);
            });
        });

        // Calculate market metrics
        const trends = Object.entries(marketData)
            .map(([date, data]) => ({
                date: new Date(date),
                price: Number((data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length).toFixed(2))
            }))
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        const prices = trends.map(t => t.price);
        const movingAverages = calculateMovingAverage(prices);
        const percentageChanges = calculatePercentageChanges(prices);

        return trends.map((item, index) => ({
            date: item.date.toLocaleDateString(),
            price: item.price,
            movingAverage: movingAverages[index],
            percentageChange: percentageChanges[index]
        }));
    };

    const getChartData = (): PriceDataPoint[] => {
        const data = selectedProperty === 'all'
            ? getMarketTrends()
            : getPropertyPriceTrends(properties.find(p => p.id.toString() === selectedProperty)!);

        switch (trendType) {
            case 'moving-average':
                return data.map(point => ({
                    ...point,
                    price: point.movingAverage ?? point.price
                }));
            case 'percentage-change':
                return data.map(point => ({
                    ...point,
                    price: point.percentageChange ?? 0
                }));
            default:
                return data;
        }
    };

    const chartData = getChartData();

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
                <div className="flex gap-4 mb-4">
                    <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a property" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Market Average</SelectItem>
                            {properties.map(property => (
                                <SelectItem key={property.id} value={property.id.toString()}>
                                    Property ID: {property.id} - {property.address}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={trendType} onValueChange={(value: any) => setTrendType(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select trend type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="raw">Raw Prices</SelectItem>
                            <SelectItem value="moving-average">Moving Average (3-day)</SelectItem>
                            <SelectItem value="percentage-change">Percentage Change</SelectItem>
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
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                                name={trendType === 'percentage-change' ? '% Change' : 'Price'}
                            />
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
