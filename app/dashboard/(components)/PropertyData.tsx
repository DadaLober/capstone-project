export interface PropertyData {
    address: string;
    latitude: number;
    longitude: number;
    size: string;
    price: string;
    attributes: string[];
    files: File[];
    }
    
    export const propertyData: PropertyData = {
        address: '123 Example St',
        latitude: 40.7128,
        longitude: -74.0060,
        size: '100 sqm',
        price: '$5000',
        attributes: [],
        files: [] // You can add File objects here for testing if needed
    };
    