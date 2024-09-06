'use client'

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useProperties } from '@/app/test/(hooks)/useProperties';
import { PropertyCard } from '@/app/test/(components)/propertyCard';

const MapComponent = dynamic(() => import('@/app/test/(components)/mapComponent'), {
    ssr: false,
});

function TestPage() {
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const { data, isLoading, isError } = useProperties();

    const handleCardClick = (propertyId: number) => {
        setSelectedPropertyId(propertyId);
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
                        />
                    ))}
                </div>
            </div>
            <MapComponent
                location={data?.find(p => p.id === selectedPropertyId)?.location ?? null}
                propertyInfo={data?.find(p => p.id === selectedPropertyId) ?? null}
            />
        </div>
    );
}

export default TestPage;
