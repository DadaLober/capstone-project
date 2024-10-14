'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { exportToCSV } from "./exportUtils";

interface ExportButtonProps {
    data: any[];
    filename: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename }) => {
    const handleExportCSV = () => {
        exportToCSV(data, `${filename}.csv`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportCSV}>Export to CSV</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ExportButton;