import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home, MapPin, DollarSign, Calendar, BookmarkCheck } from "lucide-react";
import axios from 'axios';

interface Location {
    lng: number;
    lat: number;
}

interface PriceHistory {
    price: number;
    time: string;
}

interface ArchivedProperty {
    property: {
        id: number;
        location: Location;
        address: string;
        status: string;
        sqm: number;
        priceHistory: PriceHistory[];
        createdAt: string;
        otherAttributes: {
            [key: string]: any;
        };
    };
    reservations: {
        id: number;
        propertyId: number;
        userId: number;
        expiresAt: string;
        createdAt: string;
        status: string;
    }[];
    attachments: any;
}


export const ArchivedPropertiesTable: React.FC = () => {
    const [properties, setProperties] = useState<ArchivedProperty[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/archived`);
                console.log(response.data)
                setProperties(response.data);
            } catch (error) {
                console.error('Error fetching archived properties:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, []);

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="text-center">Loading...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Archived Properties</CardTitle>
            </CardHeader>
            <CardContent>
                {properties.length === 0 ? (
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
                            {properties.map((property) => (
                                <TableRow key={property.property.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Home className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div className="font-medium">{property.property.address}</div>
                                                <div className="text-sm text-muted-foreground">{property.property.sqm} sqm</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div>Lat: {property.property.location.lat}</div>
                                                <div>Lng: {property.property.location.lng}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            <span>{property.property.priceHistory[0]?.price || 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{new Date(property.property.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <BookmarkCheck className="h-4 w-4 text-muted-foreground" />
                                            {property.reservations[0] ? (
                                                <div>
                                                    <div>Status: {property.reservations[0].status}</div>
                                                    <div>Expires: {new Date(property.reservations[0].expiresAt).toLocaleDateString()}</div>
                                                </div>
                                            ) : (
                                                'No reservation'
                                            )}
                                        </div>
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
