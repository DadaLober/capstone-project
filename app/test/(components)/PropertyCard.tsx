import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reservations } from "@/app/dashboard/(hooks)/types";

interface PropertyCardProps {
    property: Reservations;
    isSelected: boolean;
    onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isSelected, onClick }) => {
    return (
        <Card
            className={`mb-4 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle>Property ID: {property.propertyId}</CardTitle>
            </CardHeader>
            <CardContent>
                <p><strong>Address:</strong> {property.propertyInfo[0].address}</p>
                <p><strong>Status:</strong> {property.status}</p>
                <p><strong>Fee:</strong> ${property.fee}</p>
                <p><strong>Expires At:</strong> {new Date(property.expiresAt).toLocaleDateString()}</p>
            </CardContent>
        </Card>
    );
};