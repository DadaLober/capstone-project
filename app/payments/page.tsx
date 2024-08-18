import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
    // Fetch data TODO
    return [
        {
            id: "728ed52f",
            amount: 1001,
            status: "pending",
            email: "zzz@example.com",
        },
        {
            id: "728ed52f",
            amount: 1002121,
            status: "pending",
            email: "miller@example.com",
        },
        {
            id: "728ed52f",
            amount: 513,
            status: "pending",
            email: "jerald@example.com",
        },
    ]
}

export default async function DemoPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
