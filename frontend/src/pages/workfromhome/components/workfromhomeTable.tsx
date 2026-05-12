import { useWftStatusMutation } from '@/pages/workfromhome/hooks/useWfhHooks';
import useUser from '@/helpers/stores/usersStore';
// import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import type { WFHStatus, WorkFromHomeTableProps } from '../types/wfh.types';

function WorkFromHomeTable({ tableData }: WorkFromHomeTableProps) {

    const { user } = useUser()

    const { mutate: updateWFHStatus } = useWftStatusMutation()

    const handleStatusChange = (id: number, status: WFHStatus) => {
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
                {tableData?.map((item: any, index: number) => (
                    <TableRow key={item?.id}>
                        <TableCell>
                            <div className='font-medium'>{index + 1}</div>
                        </TableCell>
                        {user?.role == "admin" ?
                            <TableCell>
                                <div>
                                    <div className='font-medium'>
                                        {`${item?.employee_name}`}
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
                                        disabled={item?.status !== "pending"}
                                        value={item?.status}
                                        onValueChange={
                                            (value) => handleStatusChange(item.id, value as WFHStatus)
                                        }
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
                            <p className='font-medium'>{item?.reason}</p>

                            {/* <article className="whitespace-normal break-words">
                                <p className='font-medium'>{item?.reason}</p>
                            </article> */}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default WorkFromHomeTable;