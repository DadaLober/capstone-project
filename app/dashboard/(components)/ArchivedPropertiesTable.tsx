import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Ruler, DollarSign } from 'lucide-react';

interface Location {
    lng: number;
    lat: number;
}

interface PriceHistory {
    price: number;
    time: string;
}

interface ArchivedProperty {
    id: number;
    location: Location;
    address: string;
    status: string;
    sqm: number;
    priceHistory: PriceHistory[];
    createdAt: string;
    reservation?: {
        id: number;
        propertyId: number;
        userId: number;
        expiresAt: string;
        createdAt: string;
        status: string;
    };
}

const ARCHIVED_PROPERTIES: ArchivedProperty[] = [
    {
        "id": 1,
        "location": {
            "lng": 120.9363627433777,
            "lat": 15.449899049276933
        },
        "address": "Sumacab Sur, Cabanatuan, Nueva Ecija, Central Luzon, 3101, Philippines",
        "status": "",
        "sqm": 123123,
        "priceHistory": [
            {
                "price": 123122,
                "time": "2024-12-05T06:00:50.48Z"
            }
        ],
        "createdAt": "2024-12-05T06:00:50.714352Z",
        "reservation": {
            "id": 8,
            "propertyId": 1,
            "userId": 2,
            "expiresAt": "2024-12-25T15:14:00Z",
            "createdAt": "2024-12-10T15:21:44.808974Z",
            "status": "active"
        }
    },
    {
        "id": 4,
        "location": {
            "lng": 120.95245599746706,
            "lat": 15.459947309670456
        },
        "address": "Villa Benita Subdivision, Cabanatuan, Nueva Ecija, Central Luzon, 3100, Philippines",
        "status": "",
        "sqm": 3423423,
        "priceHistory": [
            {
                "price": 423423,
                "time": "2024-12-05T06:01:15.621Z"
            }
        ],
        "createdAt": "2024-12-05T06:01:15.891512Z",
    },
    {
        "id": 5,
        "location": {
            "lng": 120.95221996307374,
            "lat": 15.454106875228543
        },
        "address": "Lakewood Avenue, Don Jose de Real Subdivision, Cabanatuan, Nueva Ecija, Central Luzon, 3100, Philippines",
        "status": "",
        "sqm": 234234,
        "priceHistory": [
            {
                "price": 2342341,
                "time": "2024-12-05T06:01:23.893Z"
            }
        ],
        "createdAt": "2024-12-05T06:01:24.068304Z",
    },
    {
        "id": 6,
        "location": {
            "lng": 120.94943046569826,
            "lat": 15.450505592593714
        },
        "address": "Bilbao Street, Primavera Homes, Cabanatuan, Nueva Ecija, Central Luzon, 3101, Philippines",
        "status": "",
        "sqm": 423423,
        "priceHistory": [
            {
                "price": 42341,
                "time": "2024-12-05T06:01:31.18Z"
            }
        ],
        "createdAt": "2024-12-05T06:01:31.447674Z",
    },
    {
        "id": 7,
        "location": {
            "lng": 120.93945264816286,
            "lat": 15.449854038389475
        },
        "address": "Nueva Ecija University of Science and Technology - Main Campus, Ithaca Street, Acropolis North, Cabanatuan, Nueva Ecija, Central Luzon, 3100, Philippines",
        "status": "",
        "sqm": 2000,
        "priceHistory": [
            {
                "price": 19999,
                "time": "2024-12-10T14:27:41.561Z"
            }
        ],
        "createdAt": "2024-12-10T14:27:41.965938Z",
    }
];

export const ArchivedPropertiesTable: React.FC = () => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(value);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Archived Properties</CardTitle>
            </CardHeader>
            <CardContent>
                {ARCHIVED_PROPERTIES.length === 0 ? (
                    <p className="text-muted-foreground">No archived properties found.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property Details</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Reservation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ARCHIVED_PROPERTIES.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Ruler className="h-4 w-4 text-muted-foreground" />
                                            <span>{property.sqm.toLocaleString()} sqm</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            ID: {property.id}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="max-w-[250px] truncate">{property.address}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Lat: {property.location.lat.toFixed(4)}, Lng: {property.location.lng.toFixed(4)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            <span>{formatCurrency(property.priceHistory[0].price)}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(property.priceHistory[0].time).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(property.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {property.reservation ? (
                                            <div className="text-xs">
                                                <div>User ID: {property.reservation.userId}</div>
                                                <div>Status: {property.reservation.status}</div>
                                                <div>Expires: {new Date(property.reservation.expiresAt).toLocaleDateString()}</div>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">No Reservation</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default ArchivedPropertiesTable;