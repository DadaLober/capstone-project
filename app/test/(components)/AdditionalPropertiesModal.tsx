'use client'

import { PropertyInfo } from './MapComponent';
import { Button } from '@/components/ui/button';
import './modal.css';
import React from 'react';

interface AdditionalPropertiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyInfo: PropertyInfo | null;
}

export default function AdditionalPropertiesModal({ isOpen, onClose, propertyInfo }: AdditionalPropertiesModalProps) {
    return (
        <div className={`modal ${isOpen ? 'is-open' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-content flex flex-col p-6 max-w-md w-full mx-auto">
                <h3 className="title is-3 mt-4 mb-4 font-bold text-lg text-center">Additional Property Information</h3>
                <div className="content flex-grow space-y-4">
                    {propertyInfo && Object.entries(propertyInfo.otherAttributes || {}).map(([key, value]) => (
                        <>
                            <div key={key} className="flex items-start justify-between">
                                <p className="font-bold mr-2 text-base">{key}:</p>
                                <span className="text-gray-600">{value}</span>
                            </div>
                            <hr />
                            <Button className="modal-close-button flex-shrink-0" aria-label="close" onClick={onClose}>
                                Close
                            </Button>
                        </>
                    ))}
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
