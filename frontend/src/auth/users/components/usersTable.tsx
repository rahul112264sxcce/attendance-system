import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import type { UsersTableProps } from "../types/users.types"
import { ChevronUp } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner";


function UsersTable({ users, noUser, loading, setOrder }: UsersTableProps) {

    const toggleSort = () => {
        setOrder(prev => (prev === "asc" ? "desc" : "asc"))
    }

    return (
        <>
            <ScrollArea className="h-[410px]  rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className='hover:bg-transparent'>
                            <TableHead className="flex items-center justify-between">
                                Emp Id
                                <div className="flex gap-3">
                                    <ChevronUp
                                        className="w-4 hover:text-primary cursor-pointer"
                                        onClick={toggleSort}
                                    />
                                    <ChevronDown
                                        className="w-4 hover:text-primary cursor-pointer"
                                        onClick={toggleSort}
                                    />
                                </div>
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-6">
                                    <Spinner className="mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : noUser ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-100  text-gray-500">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((item) => (
                                <TableRow key={item?.id}>
                                    <TableCell>{item?.employee_id}</TableCell>
                                    <TableCell>{item?.first_name} {item?.last_name}</TableCell>
                                    <TableCell>{item?.email}</TableCell>
                                    <TableCell>{item?.role}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>
        </>
    )
}

export default UsersTable


