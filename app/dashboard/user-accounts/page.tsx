import { Users, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Users[]> {
    // Fetch data TODO
    return [
        {
            id: "728ed52f",
            firstName: "dog",
            lastName: "arf",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "zzz@example.com",
        },
        {
            id: "728ed52f",
            firstName: "John Miller",
            lastName: "Lorenzo",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "miller@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
        {
            id: "728ed52f",
            firstName: "meow",
            lastName: "cat",
            contactNumber: "09123456789",
            roles: "agent",
            status: "pending",
            email: "jerald@example.com",
        },
    ]
}

export default async function UserAccountsPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
