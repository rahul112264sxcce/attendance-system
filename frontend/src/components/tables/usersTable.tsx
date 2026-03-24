import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2 } from "lucide-react"

type UserRow = {
    id: number | string
    employee_id: string
    first_name: string
    last_name: string
    email: string
    role: string
    status: string
}

type UsersTableProps = {
    users: UserRow[]
}

function UsersTable({ users }: UsersTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className='hover:bg-transparent'>
                    <TableHead>Emp Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users?.map((item) => (
                    <TableRow key={item?.id}>
                        <TableCell>
                            <div className='flex items-center gap-3'>
                                <div className='font-medium'>{`${item.employee_id}`}</div>
                            </div>
                        </TableCell>
                        <TableCell>{`${item.first_name} ${item.last_name}`}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.role}</TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="flex items-center gap-1 text-green-500">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                {item.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default UsersTable
