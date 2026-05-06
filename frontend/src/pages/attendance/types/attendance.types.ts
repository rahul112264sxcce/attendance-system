export type AttendanceDialogProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    selectedDate: string | null
    attendanceStatus?: string
    onCheckIn: () => void;
    onCheckOut: () => void;
}


export type AttendanceCheckOutResponse = {
    message: string;
    work_hours: number;
    status: string;
}

export type AttendanceCheckInResponse = {
    message: string
}


export type AttendanceTodayResponse = {
    date: string;
    in_time: string;
    out_time: string | null;
    work_hours: string | number | null;
    message: string;
    leave_type?: string;
}


export type AllAttendanceResponse = {
    date: string;
    status: 'present' | 'holiday' | 'absent' | 'leave' | string;
    in_time: string | null;
    out_time: string | null;
    work_hours: number | string | null;
    holiday_name?: string;
}