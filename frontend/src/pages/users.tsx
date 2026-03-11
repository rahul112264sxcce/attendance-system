import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useUserSession from '@/features/stores/usersStore'
import { useUsersQuery } from '@/server/queries'
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, X } from "lucide-react"

function Users() {

    const { user } = useUserSession((state) => state)
    const { data } = useUsersQuery(user?.user_id, user?.role)
    const users = Array.isArray(data) ? data : data ? [data] : []
    return (
        <>
            <div className='w-full'>
                <div className='[&>div]:rounded-sm [&>div]:border'>
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
                            {users?.map((item: any) => (
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
                                        {/* <Badge className="flex items-center gap-1 bg-red-100 text-red-700">
                                            <X className="h-4 w-4" />
                                                Inactive
                                            </Badge> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}

export default Users