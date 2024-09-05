interface Location {
    lng: number;
    lat: number;
    name?: string;
}

interface MapProps {
    location: Location | null;
    propertyInfo: PropertyInfo | null;
    onInit?: () => void;
}

interface PropertyInfo {
    id: number;
    location: Location;
    address: string;
    status?: string;
    sqm: number;
    priceHistory?: Array<{ price: number }>;
    createdAt: string;
    otherAttributes?: {
        [key: string]: string;
    };
}

interface GeocodeResult {
    display_name: string;
    address: {
        city: string;
        state: string;
        country: string;
    };
}

export type { Location, MapProps, PropertyInfo, GeocodeResult }