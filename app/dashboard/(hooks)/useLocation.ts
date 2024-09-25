import { useState, useMemo, useEffect } from 'react';
import { Location } from '@/app/dashboard/(hooks)/types';

const useLocation = (location: Location) => {
    const [currentLocation, setCurrentLocation] = useState(location);
    const memoizedLocation = useMemo(() => ({ ...location }), [location.lat, location.lng]);

    useEffect(() => {
        setCurrentLocation(memoizedLocation);
    }, [memoizedLocation]);

    return currentLocation;
};

export default useLocation;
