import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import HolidayForm from "@/components/forms/holidaysForm"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useHolidaysQuery } from "@/server/queries"

function Holidays() {
    const { data } = useHolidaysQuery()

    return (
        <>
            <Dialog>
                <DialogTrigger asChild >
                    <Button className="w-25 cursor-pointer">Add Holiday</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm [&>button]:cursor-pointer [&>button]:mt-3" >
                    <DialogHeader>
                        <DialogTitle>Add Company Holiday</DialogTitle>
                    </DialogHeader>
                    <HolidayForm />
                </DialogContent>
            </Dialog>
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
                    {data?.map((item: any ,index :any) => (
                        <TableRow key={item?.id}>
                            <TableCell>
                                <div className='font-medium'>{`${index +1}`}</div>
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
        </>
    )
}

export default Holidays