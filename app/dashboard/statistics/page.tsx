'use client'

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCard } from './(components)/PropertyCard';
import { useProperties } from './(components)/useProperties';
import { PropertyInfo } from '@/hooks/types';
import FilterComponent from './(components)/FilterComponent';
import PriceTrendsComponent from './(components)/PriceTrendsComponent';
import PriceComparisonComponent from './(components)/PriceComparisonComponent';
import Header from '../(components)/header';

const MapComponent = dynamic(() => import('@/app/dashboard/statistics/(components)/MapComponent'), {
    ssr: false,
});

const StatsComponent = dynamic(() => import('@/app/dashboard/statistics/(components)/StatsComponent'), {
    ssr: false,
});

const MAX_PRICE = 1000000000; // 1 billion
const MAX_AREA = 1000000; // 1 million sqm

const initialFilters = {
    status: 'all',
    priceMin: 0,
    priceMax: MAX_PRICE,
    areaMin: 0,
    areaMax: MAX_AREA,
    selectedArea: 'all',
};

export default function DashboardPage() {
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [filters, setFilters] = useState(initialFilters);
    const { properties, isLoading, isError } = useProperties();

    const handleCardClick = (propertyId: number) => {
        setSelectedPropertyId(propertyId);
    };

    const filteredProperties = properties.filter((property) => {
        const latestPrice = property.priceHistory && property.priceHistory.length > 0
            ? property.priceHistory[property.priceHistory.length - 1].price
            : 0;
        return (
            (filters.status === 'all' || property.status === filters.status) &&
            latestPrice >= filters.priceMin &&
            latestPrice <= filters.priceMax &&
            property.sqm >= filters.areaMin &&
            property.sqm <= filters.areaMax &&
            (filters.selectedArea === 'all' || property.address.includes(filters.selectedArea))
        );
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (isError) {
        return <div className="flex justify-center items-center h-screen">Error loading data</div>;
    }

    const NoResultsMessage = () => (
        <div className="text-center text-gray-500 p-4">
            No properties match the current filters. Try adjusting your search criteria.
        </div>
    );

    return (
        <>
            <Header />
            <div className="container mx-auto p-4">
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
                            <Card className="md:col-span-1 h-[500px] overflow-y-auto">
                                <CardHeader>
                                    <CardTitle>Properties</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {filteredProperties.length > 0 ? (
                                        filteredProperties.map((property: PropertyInfo) => (
                                            <PropertyCard
                                                key={property.id}
                                                property={property}
                                                isSelected={selectedPropertyId === property.id}
                                                onClick={() => handleCardClick(property.id)}
                                            />
                                        ))
                                    ) : (
                                        <NoResultsMessage />
                                    )}
                                </CardContent>
                            </Card>
                            <Card className="md:col-span-2">
                                <CardContent className="p-0 h-[500px]">
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
                                {filteredProperties.length > 0 ? (
                                    <StatsComponent properties={filteredProperties} />
                                ) : (
                                    <NoResultsMessage />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="pricetrends">
                        <Card>
                            <CardContent>
                                {filteredProperties.length > 0 ? (
                                    <PriceTrendsComponent properties={filteredProperties} />
                                ) : (
                                    <NoResultsMessage />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="pricecomparison">
                        <Card>
                            <CardContent>
                                {filteredProperties.length > 0 ? (
                                    <PriceComparisonComponent properties={filteredProperties} />
                                ) : (
                                    <NoResultsMessage />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}