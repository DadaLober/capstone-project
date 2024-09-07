'use client'

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useProperties } from '@/app/test/(hooks)/useProperties';
import { PropertyCard } from '@/app/test/(components)/propertyCard';
import { useQueryClient } from '@tanstack/react-query';

const MapComponent = dynamic(() => import('@/app/test/(components)/MapComponent'), {
    ssr: false,
});

function TestPage() {
    const queryClient = useQueryClient();
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const { properties: data, isLoading, isError, mutation } = useProperties();

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

    return (
        <div className="flex flex-col md:flex-row mt-5 gap-4 cool-scrollbar ">
            <div className="flex-grow overflow-y-auto pr-4 max-h-screen">
                <div className="flex flex-col ">
                    {data?.map((property) => (
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
                location={data?.find(p => p.id === selectedPropertyId)?.location ?? { lat: 15.44926200736128, lng: 120.94014116008933 }}
                propertyInfo={data?.find(p => p.id === selectedPropertyId) ?? null}
            />
        </div>
    );
}

export default TestPage;
