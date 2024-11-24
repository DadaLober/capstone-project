import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PropertyInfo } from '@/hooks/types';

interface PriceComparisonComponentProps {
    properties: PropertyInfo[];
}

const PriceComparisonComponent: React.FC<PriceComparisonComponentProps> = ({ properties }) => {
    const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
    const [baselineProperty, setBaselineProperty] = useState<string | null>(null);

    const handlePropertySelect = (propertyId: string) => {
        if (selectedProperties.includes(propertyId)) {
            setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
            if (baselineProperty === propertyId) {
                setBaselineProperty(null);
            }
        } else if (selectedProperties.length < 5) {
            setSelectedProperties([...selectedProperties, propertyId]);
            if (!baselineProperty) {
                setBaselineProperty(propertyId);
            }
        }
    };

    const getLatestPrice = (priceHistory: { price: number; time?: string }[] | undefined) => {
        return priceHistory && priceHistory.length > 0
            ? priceHistory.sort((a, b) =>
                (a.time && b.time) ? new Date(b.time).getTime() - new Date(a.time).getTime() : 0
            )[0].price
            : 0;
    };

    const getPriceHistory = (priceHistory: { price: number; time?: string }[] | undefined) => {
        return priceHistory?.sort((a, b) =>
            (a.time && b.time) ? new Date(a.time).getTime() - new Date(b.time).getTime() : 0
        ) || [];
    };

    const calculatePriceMetrics = (property: PropertyInfo) => {
        const latestPrice = getLatestPrice(property.priceHistory);
        const priceHistory = getPriceHistory(property.priceHistory);

        // Calculate price per square meter
        const pricePerSqm = latestPrice / property.sqm;

        // Calculate price change over time
        const firstPrice = priceHistory[0]?.price || latestPrice;
        const priceChange = ((latestPrice - firstPrice) / firstPrice) * 100;

        // Calculate average price
        const avgPrice = priceHistory.reduce((sum, entry) => sum + entry.price, 0) /
            (priceHistory.length || 1);

        return {
            latestPrice,
            pricePerSqm,
            priceChange,
            avgPrice
        };
    };

    const comparisonData = selectedProperties
        .map(id => properties.find(p => p.id.toString() === id))
        .filter((p): p is PropertyInfo => p !== undefined);

    const baselineMetrics = baselineProperty ?
        calculatePriceMetrics(properties.find(p => p.id.toString() === baselineProperty)!) : null;

    const getComparisonLabel = (value: number, baselineValue: number) => {
        const diff = ((value - baselineValue) / baselineValue) * 100;
        if (Math.abs(diff) < 1) return "Comparable";
        return diff > 0 ? "Higher" : "Lower";
    };

    const getTimeSeriesData = () => {
        const allDates = new Set<string>();
        const propertyData: { [key: string]: { [date: string]: number } } = {};

        comparisonData.forEach(property => {
            const history = getPriceHistory(property.priceHistory);
            propertyData[property.id] = {};

            history.forEach(entry => {
                if (entry.time) {
                    allDates.add(entry.time);
                    propertyData[property.id][entry.time] = entry.price;
                }
            });
        });

        const sortedDates = Array.from(allDates).sort();
        return sortedDates.map(date => {
            const point: any = { date };
            comparisonData.forEach(property => {
                point[`Property ${property.id}`] = propertyData[property.id][date];
            });
            return point;
        });
    };

    const timeSeriesData = getTimeSeriesData();

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Advanced Price Comparison</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Select onValueChange={handlePropertySelect}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select properties to compare (up to 5)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {properties.map(property => (
                                        <SelectItem
                                            key={property.id}
                                            value={property.id.toString()}
                                        >
                                            Property {property.id} - {property.address}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedProperties.length > 1 && (
                            <div className="flex-1">
                                <Select
                                    value={baselineProperty || undefined}
                                    onValueChange={setBaselineProperty}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select baseline property" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedProperties.map(id => (
                                            <SelectItem key={id} value={id}>
                                                Property {id} (Baseline)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {comparisonData.length > 0 && (
                        <div className="space-y-8">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Latest Price (₱)</TableHead>
                                        <TableHead>Price/m² (₱)</TableHead>
                                        <TableHead>Price Change</TableHead>
                                        <TableHead>Comparison</TableHead>
                                        <TableHead>Area (m²)</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {comparisonData.map(property => {
                                        const metrics = calculatePriceMetrics(property);
                                        const isBaseline = baselineProperty === property.id.toString();

                                        return (
                                            <TableRow key={property.id} className={isBaseline ? "bg-muted/50" : ""}>
                                                <TableCell>
                                                    Property {property.id}
                                                    {isBaseline && (
                                                        <Badge variant="outline" className="ml-2">
                                                            Baseline
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {metrics.latestPrice.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    {metrics.pricePerSqm.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={
                                                        metrics.priceChange > 0 ? "text-green-600" :
                                                            metrics.priceChange < 0 ? "text-red-600" : ""
                                                    }>
                                                        {metrics.priceChange.toFixed(1)}%
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {baselineMetrics && !isBaseline && (
                                                        <Badge variant={
                                                            metrics.latestPrice > baselineMetrics.latestPrice ? "destructive" :
                                                                metrics.latestPrice < baselineMetrics.latestPrice ? "default" : "outline"
                                                        }>
                                                            {getComparisonLabel(metrics.latestPrice, baselineMetrics.latestPrice)}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>{property.sqm}</TableCell>
                                                <TableCell>{property.status}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Price History Comparison</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={timeSeriesData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(date) => new Date(date).toLocaleDateString()}
                                        />
                                        <YAxis />
                                        <Tooltip
                                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                            formatter={(value) => [
                                                `₱${Number(value).toLocaleString()}`,
                                                "Price"
                                            ]}
                                        />
                                        <Legend />
                                        {comparisonData.map((property, index) => (
                                            <Line
                                                key={property.id}
                                                type="monotone"
                                                dataKey={`Property ${property.id}`}
                                                stroke={[
                                                    "#8884d8",
                                                    "#82ca9d",
                                                    "#ffc658",
                                                    "#ff7300",
                                                    "#00C49F"
                                                ][index % 5]}
                                                strokeWidth={
                                                    baselineProperty === property.id.toString() ? 3 : 1
                                                }
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Metrics Comparison</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={comparisonData.map(property => {
                                        const metrics = calculatePriceMetrics(property);
                                        return {
                                            name: `Property ${property.id}`,
                                            pricePerSqm: metrics.pricePerSqm,
                                            priceChange: metrics.priceChange,
                                            avgPrice: metrics.avgPrice
                                        };
                                    })}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="pricePerSqm" fill="#8884d8" name="Price per m²" />
                                        <Bar dataKey="priceChange" fill="#82ca9d" name="Price Change %" />
                                        <Bar dataKey="avgPrice" fill="#ffc658" name="Average Price" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default PriceComparisonComponent;