'use client'

import React, { useState } from 'react';
import { Download } from 'lucide-react';

interface PriceHistory {
    property_id: number;
    price: number;
    changed_at: string;
}

export default function PriceHistoryGenerator() {
    const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);

    const generatePriceHistory = (): PriceHistory[] => {
        const seasonalProperties: number[] = [4, 7, 8, 9, 10, 11, 17, 18, 19];
        const propertyIds: number[] = [4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

        const basePrices: Record<number, number> = {
            4: 90000, 5: 15000, 7: 20000, 8: 12000, 9: 28000,
            10: 28500, 11: 32200, 12: 45000, 13: 52400, 14: 24200,
            15: 45300, 16: 46200, 17: 34210, 18: 33400, 19: 33000
        };

        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-12-31');
        const weeklyDates: Date[] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            weeklyDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 7);
        }

        const history: PriceHistory[] = [];

        propertyIds.forEach(propertyId => {
            let currentPrice = basePrices[propertyId];

            weeklyDates.forEach((date, weekIndex) => {
                let seasonalAdjustment = 1;
                if (seasonalProperties.includes(propertyId)) {
                    const month = date.getMonth();
                    const weekInMonth = Math.floor((date.getDate() - 1) / 7);

                    // Base weekly variation
                    const weeklyVariation = 0.995 + Math.random() * 0.01;

                    // Dynamic seasonal adjustments with stronger recovery
                    if (month === 4) { // May - gradual decline
                        seasonalAdjustment = 0.95 - (weekInMonth * 0.03);
                    }
                    else if (month === 5) { // June - continuing decline with fluctuation
                        seasonalAdjustment = 0.85 - (weekInMonth * 0.01) + (Math.random() * 0.03);
                    }
                    else if (month === 6) { // July - summer bottom with movement
                        seasonalAdjustment = 0.80 + (Math.sin(weekInMonth) * 0.02);
                    }
                    else if (month === 7) { // August - accelerated recovery
                        seasonalAdjustment = 0.82 + (weekInMonth * 0.04) + (Math.random() * 0.02);
                    }
                    else if (month === 8) { // September - strong recovery surge
                        seasonalAdjustment = 0.94 + (weekInMonth * 0.035);
                    }
                    else if (month === 9) { // October - potential over-correction
                        seasonalAdjustment = 1.02 + (Math.random() * 0.01);
                    }

                    currentPrice = Math.round(currentPrice * weeklyVariation * seasonalAdjustment);
                } else {
                    const weeklyVariation = 0.995 + Math.random() * 0.01;
                    currentPrice = Math.round(currentPrice * weeklyVariation);
                }

                // Smaller weekly variations (-0.5% to +0.5%)
                const weeklyVariation = 0.995 + Math.random() * 0.01;

                // Apply adjustments
                currentPrice = Math.round(currentPrice * weeklyVariation * seasonalAdjustment);

                // Ensure price doesn't drop below 70% of base price
                const minPrice = basePrices[propertyId] * 0.70;
                if (currentPrice < minPrice) {
                    currentPrice = minPrice;
                }

                history.push({
                    property_id: propertyId,
                    price: currentPrice,
                    changed_at: date.toISOString()
                });
            });
        });

        return history.sort((a, b) =>
            new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime()
        );
    };

    // Rest of the component remains the same
    const handleGenerate = () => {
        const newHistory = generatePriceHistory();
        setPriceHistory(newHistory);
    };

    const handleExportJSON = () => {
        const data = JSON.stringify({ property_price_history: priceHistory }, null, 2);
        const blob = new Blob([data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        const date = new Date().toISOString().split('T')[0];
        link.download = `price_history_${date}.txt`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const handleExportCSV = () => {
        const csvRows = ['property_id,price,changed_at'];

        priceHistory.forEach(record => {
            csvRows.push(`${record.property_id},${record.price},${record.changed_at}`);
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        const date = new Date().toISOString().split('T')[0];
        link.download = `price_history_${date}.csv`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Property Price History Generator</h2>
                <p className="text-sm text-gray-600 mt-2">
                    Generates weekly price updates with controlled variations:
                    <br />• Weekly change: -1% to +2%
                    <br />• Summer reduction: 15-25% for seasonal properties
                    <br />• Transition months: 5-15% reduction
                    <br />• Minimum price: 70% of base price
                </p>
            </div>

            <div className="flex gap-4 mb-4">
                <button
                    onClick={handleGenerate}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
                >
                    Generate New Data
                </button>
                <button
                    onClick={handleExportJSON}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center"
                    disabled={priceHistory.length === 0}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export JSON
                </button>
                <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center"
                    disabled={priceHistory.length === 0}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </button>
            </div>

            <div className="mt-4">
                <div className="text-sm text-gray-500 mb-2">
                    Generated Entries: {priceHistory.length}
                </div>
                <pre className="overflow-auto max-h-96 p-4 bg-gray-100 rounded text-sm">
                    {JSON.stringify({ property_price_history: priceHistory }, null, 2)}
                </pre>
            </div>
        </div>
    );
}
