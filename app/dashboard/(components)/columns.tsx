"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Users = {
    id: number
    firstName: string
    lastName: string
    contactNumber: string
    roles: string | string[]
    status: string
    email: string
}

export const columns: ColumnDef<Users>[] = [
    {
        accessorKey: "lastName",
        header: "Last Name",
    },
    {
        accessorKey: "firstName",
        header: "First Name",
    },
    {
        accessorKey: "contactNumber",
        header: "Contact No.",
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        header: () => <div className="text-right">Actions</div>,
        id: "actions",
        cell: ({ row }) => {
            const users = row.original

            return (<div className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(`${users.id}`)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>...</DropdownMenuItem>
                        <DropdownMenuItem>...</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            )
        },
    },
    // ...
]
