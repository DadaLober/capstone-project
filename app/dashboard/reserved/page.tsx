'use client'

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { PropertyCard } from '@/app/dashboard/reserved/(components)/reservationCard';
import { useQueryClient } from '@tanstack/react-query';
import { useReservations } from '../../../hooks/useReservations';
import { FaCalendarTimes } from 'react-icons/fa';
import SkeletonCard from '../(components)/SkeletonCard';
import SkeletonMap from '../(components)/SkeletonMap';

const MapComponent = dynamic(() => import('@/app/dashboard/(components)/MapComponent'), {
    ssr: false,
    loading: () => <SkeletonMap />
});

function ReservedPage() {
    const queryClient = useQueryClient();
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const { properties, isLoading, isError, deleteMutation, markAsSoldMutation } = useReservations();

    useEffect(() => {
        if (properties && properties.length > 0 && !selectedPropertyId) {
            setSelectedPropertyId(properties[0].id);
        }
    }, [properties, selectedPropertyId]);

    const handleCardClick = (propertyId: number) => {
        setSelectedPropertyId(propertyId);
    };

    const handleDeleteProperty = async (propertyId: number) => {
        await deleteMutation.mutateAsync(propertyId);
        queryClient.invalidateQueries({ queryKey: ['properties', 'reservations'] });
    };

    const handleMarkAsSold = async (propertyId: number) => {
        await markAsSoldMutation.mutateAsync(propertyId);
        queryClient.invalidateQueries({ queryKey: ['properties', 'reservations'] });
    };

    if (isError) {
        return <div className="p-4 rounded-md bg-destructive text-destructive-foreground">Error loading reservations. Please try again later.</div>;
    }

    const renderReservationList = () => (
        isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
                <React.Fragment key={index}>
                    <SkeletonCard />
                </React.Fragment>
            ))
        ) : properties && properties.length > 0 ? (
            properties.map((reservation) => (
                <React.Fragment key={reservation.id}>
                    <PropertyCard
                        reservation={reservation}
                        isSelected={selectedPropertyId === reservation.id}
                        onClick={() => handleCardClick(reservation.id)}
                        onDelete={() => handleDeleteProperty(reservation.id)}
                        onMarkAsSold={() => handleMarkAsSold(reservation.id)}
                    />
                </React.Fragment>
            ))
        ) : (
            <div className="flex flex-col items-center justify-center h-full">
                <FaCalendarTimes className="text-gray-400 text-6xl mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Reservations Available</h2>
                <p className="text-gray-500">There are no active reservations.</p>
            </div>
        )
    );

    const selectedProperty = properties?.find(r => r.id === selectedPropertyId);

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <div className="flex flex-grow overflow-hidden h-[90vh]">
                <Suspense fallback={<div className="w-1/2 p-4"><SkeletonCard /></div>}>
                    <div className="w-1/2 p-4 overflow-y-auto custom-scrollbar">
                        <div className="space-y-4">
                            {renderReservationList()}
                        </div>
                    </div>
                </Suspense>
                <Suspense fallback={<div className="w-1/2 p-4"><SkeletonMap /></div>}>
                    <div className="w-1/2 p-4">
                        <div className="rounded-lg overflow-hidden h-[80vh]">
                            <MapComponent
                                location={selectedProperty?.propertyInfo[0]?.location ?? { lat: 15.44926200736128, lng: 120.94014116008933 }}
                                propertyInfo={selectedProperty?.propertyInfo[0] ?? null}
                            />
                        </div>
                    </div>
                </Suspense>
            </div>
        </div>
    );
}

export default ReservedPage;