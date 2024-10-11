import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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

const FilterComponent: React.FC<FilterComponentProps> = ({ filters, setFilters }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        setFilters(localFilters);
    };

    return (
        <Card className="mb-4">
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" value={localFilters.status} onValueChange={(value) => setLocalFilters(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="priceMin">Min Price</Label>
                        <Input type="number" id="priceMin" name="priceMin" value={localFilters.priceMin} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="priceMax">Max Price</Label>
                        <Input type="number" id="priceMax" name="priceMax" value={localFilters.priceMax} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="areaMin">Min Area (sqm)</Label>
                        <Input type="number" id="areaMin" name="areaMin" value={localFilters.areaMin} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="areaMax">Max Area (sqm)</Label>
                        <Input type="number" id="areaMax" name="areaMax" value={localFilters.areaMax} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="selectedArea">Selected Area</Label>
                        <Select name="selectedArea" value={localFilters.selectedArea} onValueChange={(value) => setLocalFilters(prev => ({ ...prev, selectedArea: value }))}>
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
                <Button className="mt-4" onClick={handleApplyFilters}>Apply Filters</Button>
            </CardContent>
        </Card>
    );
};

export default FilterComponent;