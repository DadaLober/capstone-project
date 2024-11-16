"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type Users = {
    id: number
    firstName: string
    lastName: string
    contactNumber: string
    roles: string | string[]
    status: string
    email: string
}

type TableMeta = {
    updateData: (rowId: number, columnId: string, value: unknown) => void
}

const SortableHeader = ({ column, title }: { column: any; title: string }) => {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className={cn(
                "w-full justify-start",
                column.getIsSorted() && "bg-muted font-bold"
            )}
        >
            {title}
            {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
        </Button>
    )
}

export const columns: ColumnDef<Users, any>[] = [
    {
        accessorKey: "lastName",
        header: ({ column }) => <SortableHeader column={column} title="Last Name" />,
    },
    {
        accessorKey: "firstName",
        header: ({ column }) => <SortableHeader column={column} title="First Name" />,
    },
    {
        accessorKey: "contactNumber",
        header: "Contact No.",
    },
    {
        accessorKey: "email",
        header: ({ column }) => <SortableHeader column={column} title="Email" />,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <SortableHeader column={column} title="Status" />,
        cell: ({ row }) => {
            return <span>{row.original.status}</span>
        },
    },
    {
        header: () => <div className="text-right">Actions</div>,
        id: "actions",
        cell: ({ row, table }) => {
            const users = row.original

            const activateAccount = async () => {
                try {
                    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, { id: users.id, action: 'activate' });
                    (table.options.meta as TableMeta)?.updateData(users.id, 'status', 'active');
                } catch (error) {
                    console.error('Error activating account:', error);
                }
            }

            const suspendAccount = async () => {
                try {
                    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, { id: users.id, action: 'suspend' });
                    (table.options.meta as TableMeta)?.updateData(users.id, 'status', 'suspended');
                } catch (error) {
                    console.error('Error suspending account:', error);
                }
            }

            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={activateAccount}>
                                Activate Account
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={suspendAccount}>
                                Suspend Account
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(`${users.id}`)}
                            >
                                Copy ID
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
    // ...
]