'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/app/dashboard/(components)/PropertyCard';
import { useQueryClient } from '@tanstack/react-query';
import { PropertyInfo } from '../../../hooks/types';
import AddFormModal from './updateForm';
import SkeletonCard from './SkeletonCard';
import SkeletonMap from './SkeletonMap';
import { ReservePropertyModal } from './addReservationForm';
import { MapPinHouse } from 'lucide-react';
import Header from './header';

const MapComponent = dynamic(() => import('@/app/dashboard/(components)/MapComponent'), {
    ssr: false,
    loading: () => <SkeletonMap />
});

function DashboardContent() {
    const queryClient = useQueryClient();
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('');
    const { properties, isLoading, isError, deleteMutation: deleteProperty } = useProperties();

    const handleAction = (property: PropertyInfo, action: 'select' | 'delete' | 'reserve' | 'update') => {
        switch (action) {
            case 'select':
                setSelectedPropertyId(property.id);
                break;
            case 'delete':
                handleDeleteProperty(property);
                break;
            case 'reserve':
                setSelectedPropertyId(property.id);
                setIsReserveModalOpen(true);
                break;
            case 'update':
                handleUpdateProperty();
                break;
        }
    };

    const handleDeleteProperty = async (property: PropertyInfo) => {
        await deleteProperty.mutateAsync(property.id);
        queryClient.invalidateQueries({ queryKey: ['properties'] });
    };

    const handleUpdateProperty = async () => {
        setIsFormOpen(true);
        queryClient.invalidateQueries({ queryKey: ['properties'] });
    };

    const handleSort = (criteria: string) => {
        setSortBy(criteria);
    };

    const filteredProperties = React.useMemo(() => {
        let sorted = properties?.filter(property => {
            if (!searchQuery.trim()) return true;

            const searchLower = searchQuery.toLowerCase();
            const latestPrice = property.priceHistory?.[property.priceHistory.length - 1]?.price;

            const searchableFields = [
                property.address.toLowerCase(),
                latestPrice?.toString(),
                property.sqm?.toString(),
            ];

            return searchableFields.some(field => field?.includes(searchLower));
        });

        if (sorted && sortBy) {
            sorted = sorted.sort((a, b) => {
                switch (sortBy) {
                    case 'updated':
                        const lastTimeA = a.priceHistory?.[a.priceHistory?.length - 1]?.time || '';
                        const lastTimeB = b.priceHistory?.[b.priceHistory?.length - 1]?.time || '';
                        return new Date(lastTimeB).getTime() - new Date(lastTimeA).getTime();
                    case 'status':
                        return (a.status || '').localeCompare(b.status || '');
                    case 'price_asc': {
                        const lastPriceA = a.priceHistory?.[a.priceHistory?.length - 1]?.price || 0;
                        const lastPriceB = b.priceHistory?.[b.priceHistory?.length - 1]?.price || 0;
                        return lastPriceA - lastPriceB;
                    }
                    case 'price_desc': {
                        const lastPriceA = a.priceHistory?.[a.priceHistory?.length - 1]?.price || 0;
                        const lastPriceB = b.priceHistory?.[b.priceHistory?.length - 1]?.price || 0;
                        return lastPriceB - lastPriceA;
                    }
                    case 'sqm':
                        return (b.sqm || 0) - (a.sqm || 0);
                    default:
                        return 0;
                }
            });
        }

        return sorted;
    }, [properties, searchQuery, sortBy]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const renderPropertyList = () => (
        isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
                <React.Fragment key={index}>
                    <SkeletonCard />
                </React.Fragment>
            ))
        ) : filteredProperties && filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
                <React.Fragment key={property.id}>
                    <PropertyCard
                        property={property}
                        isSelected={selectedPropertyId === property.id}
                        onClick={() => handleAction(property, 'select')}
                        onDelete={() => handleAction(property, 'delete')}
                        onAddToReserved={() => handleAction(property, 'reserve')}
                        onUpdate={() => handleAction(property, 'update')}
                    />
                </React.Fragment>
            ))
        ) : (
            <div className="flex flex-col items-center justify-center h-full">
                <MapPinHouse className="text-gray-400 text-6xl mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Properties Found</h2>
                <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
        )
    );

    if (isError) {
        return <div className="p-4 rounded-md bg-destructive text-destructive-foreground">Error loading properties. Please try again later.</div>;
    }

    return (
        <>
            <Header onSearch={handleSearch} onSort={handleSort} />
            <div className="flex flex-col h-screen bg-background text-foreground">
                <div className="flex flex-grow overflow-hidden">
                    <Suspense fallback={<div className="w-1/2 p-4"><SkeletonCard /></div>}>
                        <div className="w-1/2 p-4 overflow-y-auto custom-scrollbar h-[90vh]">
                            <div className="space-y-4">
                                {renderPropertyList()}
                            </div>
                        </div>
                    </Suspense>
                    <Suspense fallback={<div className="w-1/2 p-4"><SkeletonMap /></div>}>
                        <div className="w-1/2 p-4">
                            <div className="rounded-lg overflow-hidden h-[80vh]">
                                <MapComponent
                                    location={properties?.find(p => p.id === selectedPropertyId)?.location ?? { lat: 15.44926200736128, lng: 120.94014116008933 }}
                                    propertyInfo={properties?.find(p => p.id === selectedPropertyId) ?? null}
                                />
                            </div>
                        </div>
                    </Suspense>
                </div>
                {isFormOpen && properties && (
                    <AddFormModal
                        isOpen={true}
                        onClose={() => setIsFormOpen(false)}
                        property={properties.find(p => p.id === selectedPropertyId) ?? null}
                    />
                )}
                {isReserveModalOpen && selectedPropertyId && (
                    <ReservePropertyModal
                        isOpen={isReserveModalOpen}
                        onClose={() => {
                            setIsReserveModalOpen(false);
                            queryClient.invalidateQueries({ queryKey: ['reservations', 'properties'] });
                        }}
                        propertyId={selectedPropertyId}
                    />
                )}
            </div>
        </>
    );
}

export default DashboardContent;