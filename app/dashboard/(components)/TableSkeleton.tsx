import React from 'react';


const TableSkeleton: React.FC = () => {
    return (
        <div>
            <div className="flex items-center py-4 space-x-2">
                <div className="h-10 bg-gray-200 rounded w-64"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="rounded-md border border-gray-200">
                <div className="bg-gray-50 p-4">
                    <div className="grid grid-cols-6 gap-4">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="h-6 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
                <div className="divide-y divide-gray-200">
                    {[...Array(5)].map((_, rowIndex) => (
                        <div key={rowIndex} className="p-4">
                            <div className="grid grid-cols-6 gap-4">
                                {[...Array(6)].map((_, colIndex) => (
                                    <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
    );
};

export default TableSkeleton;