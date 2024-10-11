import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Reservations } from "@/app/dashboard/(hooks)/types";
import ExportButton from './ExportButton';

interface StatsComponentProps {
    properties: Reservations[];
}

const StatsComponent: React.FC<StatsComponentProps> = ({ properties }) => {
    const getLatestPrice = (priceHistory: { price: number; time: string }[]) => {
        return priceHistory.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0].price;
    };

    const totalProperties = properties.length;
    const totalPrices = properties.reduce((sum, property) => {
        const latestPrice = getLatestPrice(property.propertyInfo[0].priceHistory ?? []);
        return sum + latestPrice;
    }, 0);
    const averagePrice = totalPrices / totalProperties;
    const totalArea = properties.reduce((sum, property) => sum + property.propertyInfo[0].sqm, 0);
    const averagePricePerSqm = totalPrices / totalArea;

    const statusCounts = properties.reduce((acc, property) => {
        acc[property.status] = (acc[property.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
    }));

    const activeProperties = properties.filter(p => p.status === 'active').length;
    const activePercentage = (activeProperties / totalProperties) * 100;

    const areaVsPriceData = properties.map(property => {
        const latestPrice = getLatestPrice(property.propertyInfo[0].priceHistory ?? []);
        const area = property.propertyInfo[0].sqm;
        return {
            id: property.id,
            area: area,
            price: latestPrice,
            pricePerSqm: Number((latestPrice / area).toFixed(2)),
        };
    });

    const exportData = properties.map(property => {
        const latestPrice = getLatestPrice(property.propertyInfo[0].priceHistory ?? []);
        return {
            id: property.id,
            propertyId: property.propertyId,
            userId: property.userId,
            status: property.status,
            price: latestPrice,
            expiresAt: property.expiresAt,
            createdAt: property.createdAt,
            address: property.propertyInfo[0].address,
            area: property.propertyInfo[0].sqm,
            latitude: property.propertyInfo[0].location.lat,
            longitude: property.propertyInfo[0].location.lng,
            pricePerSqm: Number((latestPrice / property.propertyInfo[0].sqm).toFixed(2)),
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