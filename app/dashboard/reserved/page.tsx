'use client';
import React from 'react';
import MapComponent from './MapComponent';

const MapPage = () => {
    return (
        <div className="container mx-auto py-10">
            <h1>My Map Page</h1>
            <MapComponent center={[15.448316636431805, 120.9408208391264]} zoom={17} />
        </div>
    );
};

export default MapPage;
