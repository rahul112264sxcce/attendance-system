import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useWorkFromHomeRequestQuery } from '@/server/queries';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useUserSession from '@/features/stores/usersStore';
import { useWftStatusMutation } from '@/server/mutate';
import { Badge } from '@/components/ui/badge';

function WorkFromHomeTable() {
    const user = useUserSession((state) => state.user)

    const { data: workfromhomedata } = useWorkFromHomeRequestQuery()
    const { mutate: updateWFHStatus } = useWftStatusMutation()
    console.log(workfromhomedata, 'data');
    const handleStatusChange = (id: number, status: string) => {
        updateWFHStatus({
            id,
            status
        })
    }
    return (
        <Table>
            <TableHeader>
                <TableRow className='hover:bg-transparent'>
                    <TableHead>SI No</TableHead>
                    {user?.role == "admin" ? <TableHead>Employee</TableHead> : ""}
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {workfromhomedata?.map((item: any, index: any) => (
                    <TableRow key={item?.id}>
                        <TableCell>
                            <div className='font-medium'>{index + 1}</div>
                        </TableCell>
                        {user?.role == "admin" ?
                            <TableCell>
                                <div>
                                    <div className='font-medium'>
                                        {`${item?.first_name} ${item?.last_name}`}
                                    </div>
                                    <div className='text-gray-500'>
                                        {item?.employee_id}
                                    </div>
                                </div>
                            </TableCell>
                            : ''
                        }
                        <TableCell>
                            <div className='font-medium'>{item?.start_date}</div>
                        </TableCell>
                        <TableCell>
                            <div className='font-medium'>{item?.end_date}</div>
                        </TableCell>
                        {user?.role == "admin" ?
                            <TableCell>
                                <div className='font-medium'>
                                    <Select
                                        disabled={item.status !== "pending"}
                                        value={item?.status}
                                        onValueChange={(value) => handleStatusChange(item.id, value)}
                                    >
                                        <SelectTrigger
                                            className={`
                                                  !p-[10px] !h-[26px] cursor-pointer
                                                ${item.status === "pending"
                                                    ? "bg-blue-100 border-blue-500"
                                                    : item?.status === "approved"
                                                        ? "bg-emerald-100 border-emerald-500"
                                                        : "bg-red-100 border-red-500"
                                                }`}                                     >
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending" className='cursor-pointer'>Pending</SelectItem>
                                            <SelectItem value="approved" className='cursor-pointer'>Approved</SelectItem>
                                            <SelectItem value="rejected" className='cursor-pointer'>Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TableCell>
                            : <TableCell>
                                {item.status === "pending"
                                    ?
                                    <Badge variant="secondary" className=" text-blue-500 border-blue-500">
                                        {item.status}
                                    </Badge>
                                    : item?.status === "approved"
                                        ?
                                        <Badge variant="secondary" className=" text-green-500">
                                            {item.status}
                                        </Badge>
                                        :
                                        <Badge variant="secondary" className="text-red-500 border-red-500">
                                            {item.status}
                                        </Badge>
                                }
                            </TableCell>
                        }
                        <TableCell>
                            <div className='font-medium'>{item?.reason}</div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default WorkFromHomeTable;