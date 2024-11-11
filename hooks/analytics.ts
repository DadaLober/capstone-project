import { PropertyInfo, Reservations, UserInfo } from "@/hooks/types";

export interface AgentPerformanceMetrics {
    id: string;
    name: string;
    propertiesSold: number;
    totalSalesValue: number;
    recentSales: Array<{
        propertyName: string;
        price: number;
        date: string;
    }>;
    performanceChange: number;
}

export const calculateAgentPerformance = (
    agents: UserInfo[],
    properties: PropertyInfo[],
    reservations: Reservations[],
    period: 'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear'
): AgentPerformanceMetrics[] => {
    const now = new Date();
    const periodStart = getPeriodStart(now, period);

    return agents
        .map(agent => {
            const agentReservations = reservations.filter(
                res => res.userId === agent.id && res.status === "sold"
            );

            const periodSales = agentReservations.filter(
                res => new Date(res.createdAt) >= periodStart
            );

            const totalSalesValue = calculateTotalSales(periodSales, properties);
            const previousPeriodSales = calculatePreviousPeriodSales(
                agentReservations,
                periodStart,
                getPeriodStart(periodStart, period)
            );

            return {
                id: agent.id.toString(),
                name: `${agent.firstName} ${agent.lastName}`,
                propertiesSold: periodSales.length,
                totalSalesValue,
                recentSales: getRecentSales(periodSales, properties),
                performanceChange: calculatePerformanceChange(
                    totalSalesValue,
                    previousPeriodSales
                )
            };
        })
        .sort((a, b) => b.totalSalesValue - a.totalSalesValue);
};
const getPeriodStart = (date: Date, period: string): Date => {
    const result = new Date(date);
    switch (period) {
        case 'thisWeek':
            result.setDate(result.getDate() - 7);
            break;
        case 'thisMonth':
            result.setMonth(result.getMonth() - 1);
            break;
        case 'thisQuarter':
            result.setMonth(result.getMonth() - 3);
            break;
        case 'thisYear':
            result.setFullYear(result.getFullYear() - 1);
            break;
    }
    return result;
};

const calculateTotalSales = (sales: Reservations[], properties: PropertyInfo[]): number => {
    return sales.reduce((total, sale) => {
        const property = properties.find(p => p.id === sale.propertyId);
        const price = property?.priceHistory?.[property.priceHistory.length - 1]?.price || 0;
        return total + price;
    }, 0);
};

const getRecentSales = (sales: Reservations[], properties: PropertyInfo[]) => {
    return sales
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
        .map(sale => {
            const property = properties.find(p => p.id === sale.propertyId);
            return {
                propertyName: property?.address?.split(',')[0] || 'Unknown Property',
                price: property?.priceHistory?.[property.priceHistory.length - 1]?.price || 0,
                date: new Date(sale.createdAt).toISOString()
            };
        });
};

const calculatePreviousPeriodSales = (
    sales: Reservations[],
    currentPeriodStart: Date,
    previousPeriodStart: Date
): number => {
    const previousSales = sales.filter(
        sale => {
            const saleDate = new Date(sale.createdAt);
            return saleDate >= previousPeriodStart && saleDate < currentPeriodStart;
        }
    );
    return previousSales.length;
};

const calculatePerformanceChange = (
    currentValue: number,
    previousValue: number
): number => {
    if (previousValue === 0) return 100;
    return ((currentValue - previousValue) / previousValue) * 100;
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export interface PerformanceMetrics {
    propertiesSold: number;
    previousPeriodSold: number;
    estimatedSales: number;
    previousPeriodSales: number;
    percentageChange: number;
    recentSales: Array<{
        name: string;
        price: number;
        date: string;
        timeAgo: string;
    }>;
}

export const calculatePerformanceMetrics = (
    properties: PropertyInfo[],
    reservations: Reservations[],
    currentUser: UserInfo,
    period: 'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear'
): PerformanceMetrics => {
    const now = new Date();
    const periodRanges = {
        thisWeek: {
            current: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
            previous: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14)
        },
        thisMonth: {
            current: new Date(now.getFullYear(), now.getMonth() - 1),
            previous: new Date(now.getFullYear(), now.getMonth() - 2)
        },
        thisQuarter: {
            current: new Date(now.getFullYear(), now.getMonth() - 3),
            previous: new Date(now.getFullYear(), now.getMonth() - 6)
        },
        thisYear: {
            current: new Date(now.getFullYear() - 1),
            previous: new Date(now.getFullYear() - 2)
        }
    };

    const currentPeriodStart = periodRanges[period].current;
    const previousPeriodStart = periodRanges[period].previous;

    // Filter reservations to only include those made by the current user and with "sold" status
    const userSoldReservations = reservations.filter(res =>
        res.status === "sold" && res.userId === currentUser.id
    );

    // Calculate current period metrics
    const currentPeriodSales = userSoldReservations.filter(res => {
        const saleDate = new Date(res.createdAt);
        return saleDate >= currentPeriodStart && saleDate <= now;
    });

    // Calculate previous period metrics
    const previousPeriodSales = userSoldReservations.filter(res => {
        const saleDate = new Date(res.createdAt);
        return saleDate >= previousPeriodStart && saleDate < currentPeriodStart;
    });

    // Calculate total sales value
    const calculateSalesValue = (sales: Reservations[]) => {
        return sales.reduce((total, sale) => {
            const property = properties.find(p => p.id === sale.propertyId);
            if (property && property.priceHistory && property.priceHistory.length > 0) {
                return total + property.priceHistory[property.priceHistory.length - 1].price;
            }
            return total;
        }, 0);
    };

    const currentSalesValue = calculateSalesValue(currentPeriodSales);
    const previousSalesValue = calculateSalesValue(previousPeriodSales);

    // Calculate percentage change
    const percentageChange = previousSalesValue === 0
        ? 100
        : ((currentSalesValue - previousSalesValue) / previousSalesValue) * 100;

    // Get recent sales for the current user
    const recentSales = userSoldReservations
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(sale => {
            const property = properties.find(p => p.id === sale.propertyId);
            const latestPrice = property?.priceHistory?.[property.priceHistory.length - 1]?.price || 0;
            const saleDate = new Date(sale.createdAt);

            return {
                name: property?.address?.split(',')[0] || 'Unknown Property',
                price: latestPrice,
                date: saleDate.toISOString(),
                timeAgo: getTimeAgo(saleDate)
            };
        });
    return {
        propertiesSold: currentPeriodSales.length,
        previousPeriodSold: previousPeriodSales.length,
        estimatedSales: currentSalesValue,
        previousPeriodSales: previousSalesValue,
        percentageChange,
        recentSales
    };
};

// Utility function to format time ago
const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return "1 month ago";
    return `${Math.floor(diffDays / 30)} months ago`;
};