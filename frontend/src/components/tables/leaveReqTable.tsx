import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLeaveRequestQuery } from '@/server/queries';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useLeaveStatusMutation } from '@/server/mutate';

function LeaveRequestTable() {
    const { data: leaveReqdata } = useLeaveRequestQuery()
    const { mutate: updateLeaveStatus } = useLeaveStatusMutation()
    console.log(leaveReqdata, 'data');
    const handleStatusChange = (id: number, status: string) => {
        updateLeaveStatus({
            id,
            status
        })
    }
    return (
        <Table>
            <TableHeader>
                <TableRow className='hover:bg-transparent'>
                    <TableHead>SI No</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leaveReqdata?.map((item: any, index: any) => (
                    <TableRow key={item?.id}>
                        <TableCell>
                            <div className='font-medium'>{index + 1}</div>
                        </TableCell>
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
                        <TableCell>
                            <div className='font-medium'>{item?.leave_type}</div>
                        </TableCell>
                        <TableCell>
                            <div className='font-medium'>{item?.start_date}</div>
                        </TableCell>
                        <TableCell>
                            <div className='font-medium'>{item?.end_date}</div>
                        </TableCell>
                        <TableCell>
                            <div className='font-medium'>
                                <Select
                                    disabled={item.status !== "pending"}
                                    value={item?.status}
                                    onValueChange={(value) => handleStatusChange(item.id, value)}
                                >
                                    <SelectTrigger
                                        className={`  !p-[10px] !h-[26px] cursor-pointer
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
                        <TableCell>
                            <div className='font-medium'>{item?.reason}</div>
                        </TableCell>

                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default LeaveRequestTable;