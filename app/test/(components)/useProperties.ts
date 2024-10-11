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
                        "price": 20000,
                        "time": "2024-09-01T11:41:00Z"
                    },
                    {
                        "price": 22000,
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
        "status": "active",
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
                        "price": 30000,
                        "time": "2024-10-01T11:41:00Z"
                    },
                    {
                        "price": 32000,
                        "time": "2024-10-15T14:30:00Z"
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
                        "price": 15000,
                        "time": "2024-10-09T14:19:00Z"
                    },
                    {
                        "price": 16000,
                        "time": "2024-10-20T09:45:00Z"
                    }
                ],
                "createdAt": "2024-10-09T14:19:38.264724Z",
                "otherAttributes": {
                    "type": "residential"
                }
            }
        ]
    },
    {
        "id": 31,
        "propertyId": 196,
        "userId": 2,
        "expiresAt": "2025-01-15T23:59:59Z",
        "createdAt": "2024-10-15T10:30:00Z",
        "status": "pending",
        "fee": 120,
        "propertyInfo": [
            {
                "id": 196,
                "location": {
                    "lng": 120.94001234567890,
                    "lat": 15.460123456789012
                },
                "address": "Green Valley Subdivision, Cabanatuan City, Nueva Ecija, Central Luzon, 3100, Philippines",
                "status": "",
                "sqm": 250,
                "priceHistory": [
                    {
                        "price": 25000,
                        "time": "2024-10-15T10:30:00Z"
                    },
                    {
                        "price": 26500,
                        "time": "2024-11-01T15:45:00Z"
                    }
                ],
                "createdAt": "2024-10-15T10:30:00Z",
                "otherAttributes": {
                    "type": "residential"
                }
            }
        ]
    },
    {
        "id": 32,
        "propertyId": 197,
        "userId": 3,
        "expiresAt": "2025-02-28T23:59:59Z",
        "createdAt": "2024-10-20T14:15:00Z",
        "status": "active",
        "fee": 200,
        "propertyInfo": [
            {
                "id": 197,
                "location": {
                    "lng": 120.95987654321098,
                    "lat": 15.470987654321098
                },
                "address": "Downtown Plaza, Cabanatuan City, Nueva Ecija, Central Luzon, 3100, Philippines",
                "status": "",
                "sqm": 400,
                "priceHistory": [
                    {
                        "price": 40000,
                        "time": "2024-10-20T14:15:00Z"
                    },
                    {
                        "price": 42000,
                        "time": "2024-11-15T11:30:00Z"
                    }
                ],
                "createdAt": "2024-10-20T14:15:00Z",
                "otherAttributes": {
                    "type": "commercial"
                }
            }
        ]
    },
    {
        "id": 33,
        "propertyId": 198,
        "userId": 4,
        "expiresAt": "2025-03-31T23:59:59Z",
        "createdAt": "2024-11-01T09:00:00Z",
        "status": "active",
        "fee": 90,
        "propertyInfo": [
            {
                "id": 198,
                "location": {
                    "lng": 120.92123456789012,
                    "lat": 15.445678901234567
                },
                "address": "Riverside Avenue, Cabanatuan City, Nueva Ecija, Central Luzon, 3100, Philippines",
                "status": "",
                "sqm": 180,
                "priceHistory": [
                    {
                        "price": 18000,
                        "time": "2024-11-01T09:00:00Z"
                    },
                    {
                        "price": 19000,
                        "time": "2024-11-30T16:20:00Z"
                    }
                ],
                "createdAt": "2024-11-01T09:00:00Z",
                "otherAttributes": {
                    "type": "residential"
                }
            }
        ]
    },
    {
        "id": 34,
        "propertyId": 199,
        "userId": 5,
        "expiresAt": "2025-04-30T23:59:59Z",
        "createdAt": "2024-11-10T11:45:00Z",
        "status": "pending",
        "fee": 175,
        "propertyInfo": [
            {
                "id": 199,
                "location": {
                    "lng": 120.96543210987654,
                    "lat": 15.480123456789012
                },
                "address": "Tech Park, Cabanatuan City, Nueva Ecija, Central Luzon, 3100, Philippines",
                "status": "",
                "sqm": 350,
                "priceHistory": [
                    {
                        "price": 35000,
                        "time": "2024-11-10T11:45:00Z"
                    },
                    {
                        "price": 36500,
                        "time": "2024-12-05T10:10:00Z"
                    }
                ],
                "createdAt": "2024-11-10T11:45:00Z",
                "otherAttributes": {
                    "type": "commercial"
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