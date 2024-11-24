import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const areas = [
    { value: "all", label: "All Areas" },
    { value: "Cabanatuan", label: "Cabanatuan" },
    { value: "Nueva Ecija", label: "Nueva Ecija" },
    { value: "Central Luzon", label: "Central Luzon" },
    { value: "Aduas Centro", label: "Aduas Centro" },
    { value: "Aduas Norte", label: "Aduas Norte" },
    { value: "Aduas Sur", label: "Aduas Sur" },
    { value: "Bakod Bayan", label: "Bakod Bayan" },
    { value: "Bangad", label: "Bangad" },
    { value: "Bantug Bulalo", label: "Bantug Bulalo" },
    { value: "Bantug Norte", label: "Bantug Norte" },
    { value: "Barlis", label: "Barlis" },
    { value: "Barrera", label: "Barrera" },
    { value: "Bernardo", label: "Bernardo" },
    { value: "Bizerta", label: "Bizerta" },
    { value: "Bonifacio", label: "Bonifacio" },
    { value: "Bitas", label: "Bitas" },
    { value: "Calawagan", label: "Calawagan" },
    { value: "Camangyanan", label: "Camangyanan" },
    { value: "Campo Tinio", label: "Campo Tinio" },
    { value: "Caridad", label: "Caridad" },
    { value: "Hermogenes C. Concepcion Sr.", label: "Hermogenes C. Concepcion Sr." },
    { value: "Daang Sarile", label: "Daang Sarile" },
    { value: "Dionisio S. Garcia", label: "Dionisio S. Garcia" },
    { value: "Fatima", label: "Fatima" },
    { value: "General Luna", label: "General Luna" },
    { value: "H. Concepcion", label: "H. Concepcion" },
    { value: "Imelda", label: "Imelda" },
    { value: "Isla", label: "Isla" },
    { value: "Kalikid Norte", label: "Kalikid Norte" },
    { value: "Kalikid Sur", label: "Kalikid Sur" },
    { value: "Lagare", label: "Lagare" },
    { value: "M.S. Garcia", label: "M.S. Garcia" },
    { value: "Magsaysay North", label: "Magsaysay North" },
    { value: "Magsaysay South", label: "Magsaysay South" },
    { value: "Matadero", label: "Matadero" },
    { value: "Pagas", label: "Pagas" },
    { value: "Pamaldan", label: "Pamaldan" },
    { value: "Penarandia", label: "Penarandia" },
    { value: "Polilio", label: "Polilio" },
    { value: "Pula", label: "Pula" },
    { value: "Rizdelis", label: "Rizdelis" },
    { value: "San Isidro", label: "San Isidro" },
    { value: "San Josef Norte", label: "San Josef Norte" },
    { value: "San Josef Sur", label: "San Josef Sur" },
    { value: "San Juan Accfa", label: "San Juan Accfa" },
    { value: "San Roque Norte", label: "San Roque Norte" },
    { value: "San Roque Sur", label: "San Roque Sur" },
    { value: "Sanbermicristi", label: "Sanbermicristi" },
    { value: "Sangitan", label: "Sangitan" },
    { value: "Sap. Tamo", label: "Sap. Tamo" },
    { value: "Sumacab Este", label: "Sumacab Este" },
    { value: "Sumacab Sur", label: "Sumacab Sur" },
    { value: "Tabuc", label: "Tabuc" },
    { value: "Talipapa", label: "Talipapa" },
    { value: "Valle Cruz", label: "Valle Cruz" },
    { value: "Valdefuente", label: "Valdefuente" },
    { value: "Vijandre", label: "Vijandre" },
    { value: "Villa Ofelia", label: "Villa Ofelia" },
    { value: "Zulueta", label: "Zulueta" }
] as const;

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
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px] overflow-y-auto z-[1000]">
                                {areas.map((area) => (
                                    <SelectItem key={area.value} value={area.value}>
                                        {area.label}
                                    </SelectItem>
                                ))}
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
