import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; 
import type { AttendanceDialogProps } from '../types/attendance.types';

const AttendanceDialog = ({ 
  isOpen, 
  onOpenChange, 
  selectedDate, 
  attendanceStatus,
  onCheckIn, 
  onCheckOut 
}: AttendanceDialogProps) => {
  const status = attendanceStatus?.toLowerCase().trim()
  const showCheckOut = status === "checked in"

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-80 mx-auto">
        <DialogHeader >
          <DialogTitle>
            Attendance Date: {selectedDate}
          </DialogTitle>
          <DialogDescription className="flex justify-center w-full">
            {showCheckOut ? (
              <div
                onClick={onCheckOut}
                className="cursor-pointer h-30 w-30 mt-3 bg-red-400 rounded-full flex justify-center items-center text-white text-xl"
              >
                Check Out
              </div>
            ) : (
              <div
                onClick={onCheckIn}
                className="cursor-pointer h-30 w-30 mt-3 bg-green-400 rounded-full flex justify-center items-center text-white text-xl"
              >
                Check In
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDialog;