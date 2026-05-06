import type { holidays, holidaysResponse } from '@/pages/holidays/types/holidays.types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'

function HolidaysTable({ data }: holidaysResponse) {
    return (
        <Table>
            <TableHeader>
                <TableRow className='hover:bg-transparent'>
                    <TableHead>SI No</TableHead>
                    <TableHead>Holiday Tittle</TableHead>
                    <TableHead>Holiday Date</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((item: holidays, index: number) => (
                    <TableRow key={item?.id}>
                        <TableCell>
                            <div className='font-medium'>{`${index + 1}`}</div>
                        </TableCell>
                        <TableCell>
                            <div className='font-medium'>{`${item?.holiday_name}`}</div>
                        </TableCell>
                        <TableCell>
                            <div className='font-medium'>{`${item?.holiday_date}`}</div>
                        </TableCell>
                        <TableCell>
                            Delete / Edit
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default HolidaysTable