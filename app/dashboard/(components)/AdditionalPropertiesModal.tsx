'use client'

import React from 'react';
import type { PropertyInfo } from '@/app/dashboard/(hooks)/types';
import { Button } from '@/components/ui/button';
import '@/app/dashboard/(components)/modal.css';

interface AdditionalPropertiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyInfo: PropertyInfo | null;
}

// // kaw na bahala dine mag fetch :> dko alam yan boss
// const images = [
//     "https://picsum.photos/400/300?random=1",
//     "https://picsum.photos/400/300?random=2",
//     "https://picsum.photos/400/300?random=3",
//     "https://picsum.photos/400/300?random=4",
//     "https://picsum.photos/400/300?random=5",
//     "https://picsum.photos/400/300?random=6",
// ];


export default function AdditionalPropertiesModal({ isOpen, onClose, propertyInfo }: AdditionalPropertiesModalProps) {
    return (
        <div className={`modal ${isOpen ? 'is-open' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-content flex flex-col p-6 max-w-md w-full mx-auto">
                <h3 className="title is-3 mt-4 mb-4 font-bold text-lg text-center">Additional Property Information</h3>
                <div className="content flex-grow space-y-4">
                    {propertyInfo && Object.entries(propertyInfo.otherAttributes || {}).map(([key, value]) => (
                        <div key={key} className="flex items-start justify-between">
                            <p className="font-bold mr-2 text-base">{key}:</p>
                            <span className="text-gray-600">{value}</span>
                        </div>
                    ))}
                    <Button className="modal-close-button flex-shrink-0" aria-label="close" onClick={onClose}>
                        Close
                    </Button>
                </div>
                <div className="mt-4 text-center">
                    {propertyInfo && (
                        <Button variant="secondary" className="mt-4" onClick={() => window.open(`https://maps.google.com/?q=${propertyInfo.location?.lat},${propertyInfo.location?.lng}&center=${propertyInfo.location?.lat},${propertyInfo.location?.lng}&zoom=12`, '_blank')}>
                            View More on Google Maps
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
