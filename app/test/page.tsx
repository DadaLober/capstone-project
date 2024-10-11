'use client'

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCard } from './(components)/PropertyCard';
import { useProperties } from './(components)/useProperties';
import { Reservations } from '../dashboard/(hooks)/types';
import FilterComponent from './(components)/FilterComponent';
import PriceTrendsComponent from './(components)/PriceTrendsComponent';
import PriceComparisonComponent from './(components)/PriceComparisonComponent';

const MapComponent = dynamic(() => import('@/app/test/(components)/MapComponent'), {
    ssr: false,
});

const StatsComponent = dynamic(() => import('@/app/test/(components)/StatsComponent'), {
    ssr: false,
});

export default function DashboardPage() {
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [filters, setFilters] = useState({
        status: 'all',
        priceMin: 0,
        priceMax: Infinity,
        areaMin: 0,
        areaMax: Infinity,
        selectedArea: 'all',
    });
    const { properties, isLoading, isError } = useProperties();

    const handleCardClick = (propertyId: number) => {
        setSelectedPropertyId(propertyId);
    };

    const filteredProperties = properties.filter((property) => {
        return (
            (filters.status === 'all' || property.status === filters.status) &&
            property.fee >= filters.priceMin &&
            property.fee <= filters.priceMax &&
            property.propertyInfo[0].sqm >= filters.areaMin &&
            property.propertyInfo[0].sqm <= filters.areaMax &&
            (filters.selectedArea === 'all' || property.propertyInfo[0].address.includes(filters.selectedArea))
        );
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (isError) {
        return <div className="flex justify-center items-center h-screen">Error loading data</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Land Properties Dashboard</h1>
            <FilterComponent filters={filters} setFilters={setFilters} />
            <Tabs defaultValue="map" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="map">Map View</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                    <TabsTrigger value="pricetrends">Price Trends</TabsTrigger>
                    <TabsTrigger value="pricecomparison">Price Comparison</TabsTrigger>
                </TabsList>
                <TabsContent value="map" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="md:col-span-1 h-[calc(100vh-300px)] overflow-y-auto">
                            <CardHeader>
                                <CardTitle>Properties</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {filteredProperties.map((property: Reservations) => (
                                    <PropertyCard
                                        key={property.id}
                                        property={property}
                                        isSelected={selectedPropertyId === property.id}
                                        onClick={() => handleCardClick(property.id)}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-2 h-[calc(100vh-300px)]">
                            <CardContent className="p-0 h-full">
                                <MapComponent
                                    properties={filteredProperties}
                                    selectedPropertyId={selectedPropertyId}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="stats">
                    <Card>
                        <CardContent>
                            <StatsComponent properties={filteredProperties} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="pricetrends">
                    <Card>
                        <CardContent>
                            <PriceTrendsComponent properties={filteredProperties} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="pricecomparison">
                    <Card>
                        <CardContent>
                            <PriceComparisonComponent properties={filteredProperties} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}