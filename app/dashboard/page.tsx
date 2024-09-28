'use client'

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useProperties } from '@/app/dashboard/(hooks)/useProperties';
import { useReservations } from './(hooks)/useReservations';
import { PropertyCard } from '@/app/dashboard/(components)/PropertyCard';
import { useQueryClient } from '@tanstack/react-query';
import Header from './(components)/header';
import { PropertyInfo } from './(hooks)/types';
import AddFormModal from './(components)/updateForm';
import React from 'react';

const MapComponent = dynamic(() => import('@/app/dashboard/(components)/MapComponent'), {
    ssr: false,
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    return (
        <>
            <Header />
            <div className="flex flex-col md:flex-row mt-3 gap-4 cool-scrollbar ">
                <div className="flex-grow overflow-y-auto pr-4 max-h-screen">
                    <div className="flex flex-col">
                        {properties?.map((property) => (
                            <React.Fragment key={property.id}>
                                <PropertyCard
                                    property={property}
                                    isSelected={selectedPropertyId === property.id}
                                    onClick={() => handleAction(property, 'select')}
                                    onDelete={() => handleAction(property, 'delete')}
                                    onAddToReserved={() => handleAction(property, 'reserve')}
                                    onUpdate={() => handleAction(property, 'update')}
                                />

                                {isFormOpen && (
                                    <AddFormModal
                                        isOpen={true}
                                        onClose={() => setIsFormOpen(false)}
                                        property={properties.find(p => p.id === selectedPropertyId) ?? null}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                </div>
                <MapComponent
                    location={properties?.find(p => p.id === selectedPropertyId)?.location ?? { lat: 15.44926200736128, lng: 120.94014116008933 }}
                    propertyInfo={properties?.find(p => p.id === selectedPropertyId) ?? null}
                />
            </div>
        </>
    );
}

export default Dashboard;
