import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Reservations } from "@/app/dashboard/(hooks)/types";

interface StatsComponentProps {
    properties: Reservations[];
}

const StatsComponent: React.FC<StatsComponentProps> = ({ properties }) => {
    const totalProperties = properties.length;
    const totalFees = properties.reduce((sum, property) => sum + property.fee, 0);
    const averageFee = totalFees / totalProperties;
    const totalArea = properties.reduce((sum, property) => sum + property.propertyInfo[0].sqm, 0);
    const averagePricePerSqm = totalFees / totalArea;

    const statusCounts = properties.reduce((acc, property) => {
        acc[property.status] = (acc[property.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
    }));

    const activeProperties = properties.filter(p => p.status === 'active').length;
    const inactiveProperties = totalProperties - activeProperties;
    const activePercentage = (activeProperties / totalProperties) * 100;

    const areaData = properties.map(property => ({
        id: property.id,
        area: property.propertyInfo[0].sqm,
        fee: property.fee,
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Total Properties: {totalProperties}</p>
                    <p>Total Fees: ${totalFees.toFixed(2)}</p>
                    <p>Average Fee: ${averageFee.toFixed(2)}</p>
                    <p>Total Area: {totalArea.toFixed(2)} sqm</p>
                    <p>Average Price per sqm: ${averagePricePerSqm.toFixed(2)}</p>
                    <p>Active Properties: {activePercentage.toFixed(2)}%</p>
                </CardContent>
            </Card>
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
                    <CardTitle>Area vs Fee</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={areaData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="id" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="area" fill="#8884d8" name="Area (sqm)" />
                            <Bar yAxisId="right" dataKey="fee" fill="#82ca9d" name="Fee ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatsComponent;