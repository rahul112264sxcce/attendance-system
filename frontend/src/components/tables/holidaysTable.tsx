import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type HolidayRow = {
    id: number | string
    title: string
    holiday_date: string
}

type HolidaysTableProps = {
    data: HolidayRow[]
}

function HolidaysTable({ data }: HolidaysTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className='hover:bg-transparent'>
                    <TableHead>SI No</TableHead>
                    <TableHead>Tittle</TableHead>
                    <TableHead>Holiday Date</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((item, index) => (
                    <TableRow key={item?.id}>
                        <TableCell>
                            <div className='font-medium'>{`${index + 1}`}</div>
                        </TableCell>
                        <TableCell>
                            <div className='font-medium'>{`${item.title}`}</div>
                        </TableCell>
                        <TableCell>
                            <div className='font-medium'>{`${item.holiday_date}`}</div>
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