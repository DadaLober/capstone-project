import React from 'react';
import MapComponent from './(components)/MapWrapper';
import Header from './(components)/Header';

const Page = () => {
    return (
        <div className="container py-5">
            <div className="w-full">
                <Header />
            </div>
            <MapComponent center={[15.448316636431805, 120.9408208391264]} zoom={17} />
        </div>
    );
};

export default Page;