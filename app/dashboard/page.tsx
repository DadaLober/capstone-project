'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useProperties } from '@/app/dashboard/(hooks)/useProperties';
import { useReservations } from './(hooks)/useReservations';
import { PropertyCard } from '@/app/dashboard/(components)/PropertyCard';
import { useQueryClient } from '@tanstack/react-query';
import { PropertyInfo } from './(hooks)/types';
import AddFormModal from './(components)/updateForm';
import SkeletonCard from './(components)/SkeletonCard';
import SkeletonMap from './(components)/SkeletonMap';

const MapComponent = dynamic(() => import('@/app/dashboard/(components)/MapComponent'), {
    ssr: false,
    loading: () => <SkeletonMap />
});

function Dashboard() {
    const queryClient = useQueryClient();
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { properties, isLoading, isError, mutation: deleteProperty } = useProperties();
    const { mutation: addReserved } = useReservations();

    const handleAction = (property: PropertyInfo, action: 'select' | 'delete' | 'reserve' | 'update') => {
        switch (action) {
            case 'select':
                setSelectedPropertyId(property.id);
                break;
            case 'delete':
                handleDeleteProperty(property);
                break;
            case 'reserve':
                handleAddToReserved(property);
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

    const handleAddToReserved = async (property: PropertyInfo) => {
        await addReserved.mutateAsync(property.id);
        queryClient.invalidateQueries({ queryKey: ['reservations', 'properties'] });
    };

    const handleUpdateProperty = async () => {
        setIsFormOpen(true);
        queryClient.invalidateQueries({ queryKey: ['properties'] });
    };

    if (isError) {
        return <div className="p-4 rounded-md bg-destructive text-destructive-foreground">Error loading properties. Please try again later.</div>;
    }

    const renderPropertyList = () => (
        isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
                <React.Fragment key={index}>
                    <SkeletonCard />
                </React.Fragment>
            ))
        ) : (
            properties && properties.map((property) => (
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
        )
    );

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <div className="flex flex-grow overflow-hidden">
                <Suspense fallback={<div className="w-1/2 p-4"><SkeletonCard /></div>}>
                    <div className="w-1/2 p-4 overflow-y-auto custom-scrollbar">
                        <div className="space-y-4">
                            {renderPropertyList()}
                        </div>
                    </div>
                </Suspense>
                <Suspense fallback={<div className="w-1/2 p-4"><SkeletonMap /></div>}>
                    <div className="w-1/2 p-4">
                        <div className="rounded-lg overflow-hidden h-full">
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
        </div>
    );
}

export default Dashboard;