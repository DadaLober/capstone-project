import { useState, useEffect } from 'react';
import { Reservations } from '@/app/dashboard/(hooks)/types';

const sampleData: Reservations[] = [
    {
        "id": 28,
        "propertyId": 193,
        "userId": 1,
        "expiresAt": "2024-09-30T23:59:59Z",
        "createdAt": "2024-09-30T13:02:10.862546Z",
        "status": "active",
        "fee": 100,
        "propertyInfo": [
            {
                "id": 193,
                "location": {
                    "lng": 120.93348600023533,
                    "lat": 15.450509054067963
                },
                "address": "Sumacab Road, Sumacab Norte, Cabanatuan, Nueva Ecija, Central Luzon, 3101, Philippines",
                "status": "",
                "sqm": 200,
                "priceHistory": [
                    {
                        "price": 2,
                        "time": "2024-09-01T11:41:00Z"
                    },
                    {
                        "price": 0,
                        "time": "2024-09-30T11:43:36.775927Z"
                    }
                ],
                "createdAt": "2024-09-30T11:41:33.225215Z",
                "otherAttributes": {
                    "type": "residential"
                }
            }
        ]
    },
    {
        "id": 29,
        "propertyId": 194,
        "userId": 1,
        "expiresAt": "2024-09-30T23:59:59Z",
        "createdAt": "2024-10-11T13:03:12.862548Z",
        "status": "pending",
        "fee": 150,
        "propertyInfo": [
            {
                "id": 194,
                "location": {
                    "lng": 120.93548600023533,
                    "lat": 15.452509054067963
                },
                "address": "Main Street, Cabanatuan City, Nueva Ecija, Central Luzon, 3100, Philippines",
                "status": "",
                "sqm": 300,
                "priceHistory": [
                    {
                        "price": 3,
                        "time": "2024-10-01T11:41:00Z"
                    }
                ],
                "createdAt": "2024-10-01T11:41:33.225215Z",
                "otherAttributes": {
                    "type": "commercial"
                }
            }
        ]
    },
    {
        "id": 30,
        "propertyId": 195,
        "userId": 1,
        "expiresAt": "2024-09-30T23:59:59Z",
        "createdAt": "2024-10-11T13:03:22.8364Z",
        "status": "inactive",
        "fee": 80,
        "propertyInfo": [
            {
                "id": 195,
                "location": {
                    "lng": 120.93542758274552,
                    "lat": 15.454768591524767
                },
                "address": "Acropolis North, Cabanatuan, Nueva Ecija, Central Luzon, 3100, Philippines",
                "status": "",
                "sqm": 150,
                "priceHistory": [
                    {
                        "price": 2,
                        "time": "2024-10-09T14:19:00Z"
                    }
                ],
                "createdAt": "2024-10-09T14:19:38.264724Z",
                "otherAttributes": {
                    "type": "residential"
                }
            }
        ]
    }
];

export const useProperties = () => {
    const [properties, setProperties] = useState<Reservations[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                // Simulating API call with setTimeout
                await new Promise(resolve => setTimeout(resolve, 1000));
                setProperties(sampleData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching properties:', error);
                setIsError(true);
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return { properties, isLoading, isError };
};