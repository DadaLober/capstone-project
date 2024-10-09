import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SkeletonCard: React.FC = () => {
    return (
        <Card className="mb-4 hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
                <div className="flex items-center mb-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="ml-auto h-4 w-4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                        <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="flex justify-end items-end">
                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SkeletonCard;
