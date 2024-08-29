'use client';
import React from 'react';
import MapComponent from './(components)/MapWrapper';

const Page = () => {
    return (
        <div className="container py-5">
            <MapComponent center={[15.448316636431805, 120.9408208391264]} zoom={17} />
        </div>
    );
};

export default Page;