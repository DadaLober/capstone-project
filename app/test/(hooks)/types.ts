import L from "leaflet";

interface Location {
    lng: number;
    lat: number;
    name?: string;
}

interface PropertyInfo {
    id: number;
    location: Location;
    address: string;
    status?: string;
    sqm: number;
    priceHistory?: { date: string; price: number }[];
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

const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export { customIcon };

export type { Location, PropertyInfo, GeocodeResult };