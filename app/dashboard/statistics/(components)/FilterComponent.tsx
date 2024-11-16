import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface FilterComponentProps {
    filters: {
        status: string;
        priceMin: number;
        priceMax: number;
        areaMin: number;
        areaMax: number;
        selectedArea: string;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        status: string;
        priceMin: number;
        priceMax: number;
        areaMin: number;
        areaMax: number;
        selectedArea: string;
    }>>;
}

const initialFilters = {
    status: 'all',
    priceMin: 0,
    priceMax: 1000000000,
    areaMin: 0,
    areaMax: 1000000,
    selectedArea: 'all',
};

const FilterComponent: React.FC<FilterComponentProps> = ({ filters, setFilters }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);

        if (numValue < 0) {
            toast.error("Invalid input.", {
                description: "Please enter a positive number.",
            });
            return;
        }

        if (name === 'priceMax' && numValue <= localFilters.priceMin) {
            toast.error("Invalid Price Range", {
                description: "Maximum price must be greater than minimum price"
            });
            return;
        }

        if (name === 'areaMax' && numValue <= localFilters.areaMin) {
            toast.error("Invalid Area Range", {
                description: "Maximum area must be greater than minimum area"
            });
            return;
        }

        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        setFilters(localFilters);
        toast.success("Filters Applied", {
            description: "Your filters have been applied successfully.",
        });
    };

    const handleReset = () => {
        setLocalFilters(initialFilters);
        setFilters(initialFilters);
        toast.success("Filters Reset", {
            description: "Your filters have been reset successfully.",
        });
    };

    return (
        <Card className="mb-4">
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            name="status"
                            value={localFilters.status}
                            onValueChange={(value) => setLocalFilters(prev => ({ ...prev, status: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="reserved">Reserved</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="priceMin">Min Price</Label>
                        <Input
                            type="number"
                            id="priceMin"
                            name="priceMin"
                            min="0"
                            value={localFilters.priceMin}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="priceMax">Max Price</Label>
                        <Input
                            type="number"
                            id="priceMax"
                            name="priceMax"
                            min="0"
                            value={localFilters.priceMax}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="areaMin">Min Area (sqm)</Label>
                        <Input
                            type="number"
                            id="areaMin"
                            name="areaMin"
                            min="0"
                            value={localFilters.areaMin}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="areaMax">Max Area (sqm)</Label>
                        <Input
                            type="number"
                            id="areaMax"
                            name="areaMax"
                            min="0"
                            value={localFilters.areaMax}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="selectedArea">Selected Area</Label>
                        <Select
                            name="selectedArea"
                            value={localFilters.selectedArea}
                            onValueChange={(value) => setLocalFilters(prev => ({ ...prev, selectedArea: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Areas</SelectItem>
                                <SelectItem value="Cabanatuan">Cabanatuan</SelectItem>
                                <SelectItem value="Nueva Ecija">Nueva Ecija</SelectItem>
                                <SelectItem value="Central Luzon">Central Luzon</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <Button onClick={handleApplyFilters}>Apply Filters</Button>
                    <Button variant="outline" onClick={handleReset}>Reset Filters</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default FilterComponent;
