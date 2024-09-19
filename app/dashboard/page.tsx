'use client'

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useProperties } from '@/app/dashboard/(hooks)/useProperties';
import { useReservations } from './(hooks)/useReservations';
import { PropertyCard } from '@/app/dashboard/(components)/propertyCard';
import { useQueryClient } from '@tanstack/react-query';
import Header from './(components)/Header';

const MapComponent = dynamic(() => import('@/app/dashboard/(components)/MapComponent'), {
    ssr: false,
});

function Dashboard() {
    const queryClient = useQueryClient();
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const { properties, isLoading, isError, mutation: deleteProperty } = useProperties();
    const { mutation: addReserved } = useReservations();

    const handleAction = (propertyId: number, action: 'select' | 'delete' | 'reserve') => {
        switch (action) {
            case 'select':
                setSelectedPropertyId(propertyId);
                break;
            case 'delete':
                handleDeleteProperty(propertyId);
                break;
            case 'reserve':
                handleAddToReserved(propertyId);
                break;
        }
    };

    const handleDeleteProperty = async (propertyId: number) => {
        await deleteProperty.mutateAsync(propertyId);
        queryClient.invalidateQueries({ queryKey: ['properties'] });
    };

    const handleAddToReserved = async (id: number) => {
        await addReserved.mutateAsync(id);
        queryClient.invalidateQueries({ queryKey: ['reservations', 'properties'] });
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
                    <div className="flex flex-col ">
                        {properties?.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                isSelected={selectedPropertyId === property.id}
                                onClick={() => handleAction(property.id, 'select')}
                                onDelete={() => handleAction(property.id, 'delete')}
                                onAddToReserved={() => handleAction(property.id, 'reserve')}
                            />
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
