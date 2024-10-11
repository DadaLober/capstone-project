'use client';

import axios from 'axios';
import { columns } from "../(components)/columns";
import { DataTable } from "../(components)/data-table";
import TableSkeleton from '../(components)/TableSkeleton';
import { useState, useEffect } from 'react';

interface UserData {
    id: number;
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    roles: string[];
    status: string;
}

type UsersType = UserData[];

const API_ENDPOINT = '/api/users';

async function getData(): Promise<UsersType> {
    try {
        const response = await axios.get<UsersType>(API_ENDPOINT);
        return response.data;
    } catch (error: any) {
        if (error.response?.status) {
            console.error('status:', error.response?.status);
            console.error('data:', error.response?.data);
            return [] as UsersType;
        }
        return [] as UsersType;
    }
}

export default function UserAccountsPage() {
    const [users, setUsers] = useState<UsersType>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getData();
                setUsers(userData);
            } catch (error: any) {
                console.error('Error fetching user data:', error);
                console.error('Response Data:', error.response?.data);
                console.error('Full URL:', API_ENDPOINT);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto">
                <TableSkeleton />
            </div>
        );
    }

    if (users.length === 0) {
        return <div className="container mx-auto mt-8 text-center">No users found. Please check the console for any errors.</div>;
    }

    return (
        <div className="container mx-auto">
            <DataTable columns={columns} data={users} />
        </div>
    );
}