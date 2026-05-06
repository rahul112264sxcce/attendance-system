import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"

import {
  useAttendanceAllQuery,
  useAttendanceTodayQuery,
  useCheckInMutation,
  useCheckOutMutation
} from "./hooks/useAttendanceHooks"

import { useHolidaysQuery } from "@/pages/holidays/hooks/useHolidaysHooks"
import PageTitle from "@/helpers/pageTitles/pageTitles"
import AttendanceDialog from "./components/AttendanceDialog"

export default function AttendanceCalendar() {

  const { data: todayAttendance } = useAttendanceTodayQuery()
  const { data: allAttendance } = useAttendanceAllQuery()
  const { data: allHoliday } = useHolidaysQuery()
  
  const { mutate: checkin } = useCheckInMutation()
  const { mutate: checkout } = useCheckOutMutation()

  const [selectedDate, setSelectedDate] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const calendarRef = React.useRef<FullCalendar>(null)
  const calendarWrapperRef = React.useRef<HTMLDivElement>(null)

  const today = new Date().toISOString().split("T")[0]
  console.log(todayAttendance , "todayAttendance");
  
  let events: any[] = []


  if (allAttendance) {

    const holidaySet = new Set(
      allHoliday?.map((h: any) => h.holiday_date)
    )

    events.push(
      ...allAttendance
        .filter((item: any) =>
          item.date !== today && !holidaySet.has(item.date)
        )
        .map((item: any) => ({

          title:
            item.status === "leave"
              ? `${item.leave_type ?? ""} Leave`
              : item.status.charAt(0).toUpperCase() + item.status.slice(1),

          date: item.date,

          color:
            item.status === "present"
              ? "#22c55e"       
              : item.status === "half day"
                ? "#facc15"     
                : item.status === "pending"
                  ? "#3b82f6"
                  : item.status === "leave"
                    ? "#8b5cf6" 
                    : "#ef4444" 
        }))
    )
  }

  if (todayAttendance) {

    const status = (todayAttendance.message || "").toLowerCase().trim()

    const holidaySet = new Set(
      allHoliday?.map((h: any) => h.holiday_date)
    )

    if (!holidaySet.has(today)) {

      let color = "#9ca3af"

      if (status === "checked in") color = "#f97316"      
      else if (status === "present") color = "#22c55e"    
      else if (status === "half day") color = "#facc15"   
      else if (status === "absent") color = "#ef4444"   
      else if (status === "leave") color = "#8b5cf6"      

      events.push({
        title:
          status === "leave"
            ? `${todayAttendance.leave_type ?? ""} Leave`
            : todayAttendance.message,

        date: todayAttendance.date ?? today,
        color
      })
    }
  }

  if (allHoliday) {
    events.push(
      ...allHoliday.map((holiday: any) => ({
        title: `🎉 ${holiday.holiday_name}`,
        date: holiday.holiday_date,
        backgroundColor: "#16a34a",
        borderColor: "#16a34a"
      }))
    )
  }

  
  const handleDateClick = (info: any) => {

    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)

    const clickedDate = new Date(info.dateStr)
    clickedDate.setHours(0, 0, 0, 0)

    const holidaySet = new Set(
      allHoliday?.map((h: any) => h.holiday_date)
    )

    if (clickedDate.getTime() !== todayDate.getTime()) return
    if (holidaySet.has(info.dateStr)) return

    const status = todayAttendance?.message?.toLowerCase().trim()
    const allowedStatuses = ["checked in", "absent"]

    if (!allowedStatuses.includes(status)) return

    setSelectedDate(info.dateStr)
    setDialogOpen(true)
  }

 
  const checkIn = () => {
    checkin()
    setDialogOpen(false)
  }

  const checkOut = () => {
    checkout()
    setDialogOpen(false)
  }

  React.useEffect(() => {
    const wrapper = calendarWrapperRef.current

    if (!wrapper) return

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        calendarRef.current?.getApi().updateSize()
      })
    })

    resizeObserver.observe(wrapper)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <>
      <PageTitle title={"Attendance"} />

      <div ref={calendarWrapperRef} className="w-full min-w-0">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin
          ]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,listWeek"
          }}
          events={events}
          dateClick={handleDateClick}
          height="auto"
          selectable={true}
          dayCellClassNames={(arg) => {
            const todayDate = new Date()
            todayDate.setHours(0, 0, 0, 0)

            const cellDate = new Date(arg.date)
            cellDate.setHours(0, 0, 0, 0)

            if (cellDate.getTime() !== todayDate.getTime()) {
              return ["disabled-day"]
            }
            return ["cursor-pointer"]
          }}
        />
      </div>

      <AttendanceDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
        attendanceStatus={todayAttendance?.message}
        onCheckIn={checkIn}
        onCheckOut={checkOut}
      />
    </>
  )
}

