import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { PropertyInfo } from "@/hooks/types";
import ExportButton from './ExportButton';

interface StatsComponentProps {
    properties: PropertyInfo[];
}

const StatsComponent: React.FC<StatsComponentProps> = ({ properties }) => {
    const getLatestPrice = (priceHistory: { price: number; time: string }[] | undefined) => {
        return priceHistory && priceHistory.length > 0
            ? priceHistory.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0].price
            : 0;
    };

    const totalProperties = properties.length;
    const totalPrices = properties.reduce((sum, property) => {
        const latestPrice = getLatestPrice(property.priceHistory);
        return sum + latestPrice;
    }, 0);
    const averagePrice = totalPrices / totalProperties;
    const totalArea = properties.reduce((sum, property) => sum + property.sqm, 0);
    const averagePricePerSqm = totalPrices / totalArea;

    const statusCounts = properties.reduce((acc, property) => {
        acc[property.status || 'Unknown'] = (acc[property.status || 'Unknown'] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
    }));

    const activeProperties = properties.filter(p => p.status === 'active').length;
    const activePercentage = (activeProperties / totalProperties) * 100;

    const areaVsPriceData = properties.map(property => {
        const latestPrice = getLatestPrice(property.priceHistory);
        return {
            id: property.id,
            area: property.sqm,
            price: latestPrice,
            pricePerSqm: Number((latestPrice / property.sqm).toFixed(2)),
        };
    });

    const exportData = properties.map(property => {
        const latestPrice = getLatestPrice(property.priceHistory);
        return {
            id: property.id,
            status: property.status || 'Unknown',
            price: latestPrice,
            createdAt: property.createdAt,
            address: property.address,
            area: property.sqm,
            latitude: property.location.lat,
            longitude: property.location.lng,
            pricePerSqm: Number((latestPrice / property.sqm).toFixed(2)),
        };
    });

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">Property Statistics</CardTitle>
                    <ExportButton data={exportData} filename="property_statistics" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium">Total Properties</p>
                            <p className="text-2xl font-bold">{totalProperties}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Total Prices</p>
                            <p className="text-2xl font-bold">${totalPrices.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Average Price</p>
                            <p className="text-2xl font-bold">${averagePrice.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Total Area</p>
                            <p className="text-2xl font-bold">{totalArea.toFixed(2)} sqm</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Avg Price per sqm</p>
                            <p className="text-2xl font-bold">${averagePricePerSqm.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Active Properties</p>
                            <p className="text-2xl font-bold">{activePercentage.toFixed(2)}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="status" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Area vs Price</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="area" name="Area" unit="sqm" />
                                <YAxis type="number" dataKey="price" name="Price" unit="$" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                <Scatter name="Properties" data={areaVsPriceData} fill="#8884d8">
                                    {areaVsPriceData.map((entry, index) => (
                                        <circle key={`circle-${index}`} r={Math.sqrt(entry.pricePerSqm) / 2} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StatsComponent;