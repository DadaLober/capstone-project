'use client'

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { PropertyCard } from '@/app/dashboard/reserved/(components)/reservationCard';
import { useQueryClient } from '@tanstack/react-query';
import { useReservations } from '../(hooks)/useReservations';

const MapComponent = dynamic(() => import('@/app/dashboard/(components)/MapComponent'), {
    ssr: false,
});

function ReservedPage() {
    const queryClient = useQueryClient();
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const { properties, isLoading, isError, mutation } = useReservations();

    const handleCardClick = (propertyId: number) => {
        setSelectedPropertyId(propertyId);
    };
    const handleDeleteProperty = async (propertyId: number) => {
        await mutation.mutateAsync(propertyId);
        queryClient.invalidateQueries({ queryKey: ['properties'] });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }
    console.log(properties);

    return (
        <div className="flex flex-col md:flex-row mt-3 gap-4 cool-scrollbar ">
            <div className="flex-grow overflow-y-auto pr-4 max-h-screen">
                <div className="flex flex-col ">
                    {properties?.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            isSelected={selectedPropertyId === property.id}
                            onClick={() => handleCardClick(property.id)}
                            onDelete={() => handleDeleteProperty(property.id)}
                        />
                    ))}
                </div>
            </div>
            <MapComponent
                location={properties?.find(p => p.id === selectedPropertyId)?.propertyInfo[0]?.location ?? { lat: 15.44926200736128, lng: 120.94014116008933 }}
                propertyInfo={properties?.find(p => p.id === selectedPropertyId)?.propertyInfo[0] ?? null}
            />
        </div>
    );
}

export default ReservedPage;
