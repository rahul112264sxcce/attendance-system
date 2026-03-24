import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"

import {
  useAttendanceAllQuery,
  useAttendanceTodayQuery,
  useHolidaysQuery
} from "@/server/queries"

import {
  useCheckInMutation,
  useCheckOutMutation
} from "@/server/mutate"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

export default function AttendanceCalendar() {

  const { data: todayAttendance } = useAttendanceTodayQuery()
  const { data: allAttendance } = useAttendanceAllQuery()
  const { data: allHoliday } = useHolidaysQuery()

  const { mutate: checkin } = useCheckInMutation()
  const { mutate: checkout } = useCheckOutMutation()

  const [selectedDate, setSelectedDate] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const today = new Date().toISOString().split("T")[0]

  let events: any[] = []
  
console.log(todayAttendance ,'todayAttendance');


  if (allAttendance) {
    events.push(
      ...allAttendance
      .filter((item: any) => item.date != today)
      .map((item: any) => ({
        title: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        date: item.date,
        color:
          item.status === "present"
            ? "#22c55e"
            : item.status === "half day"
            ? "#facc15"
            : item.status === "pending"
            ? "#3b82f6"
            : item.status === "absent"
            ? "#ef4444"
            : "#000"
      }))
    )
  }

if (todayAttendance) {

  let color = "#9ca3af" 

  switch (todayAttendance.message) {
    case "Checked In":
      color = "#7bf1a8"
      break
    case "present":
      color = "#22c55e"
      break
    case "half day":
      color = "#facc15"
      break
    case "pending":
      color = "#3b82f6"
      break
    case "absent":
      color = "#ef4444"
      break
    case "No attendance":
      color = "#9ca3af" 
      break
  }

  events.push({
    title: todayAttendance.message.charAt(0).toUpperCase() + todayAttendance.message.slice(1),
    date: todayAttendance.date ?? today,
    color
  })
}


  if (allHoliday) {
    events.push(
      ...allHoliday.map((holiday: any) => ({
        title: `🎉 ${holiday.title}`,
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

    // if (
    //   todayAttendance?.message === "present" ||
    //   todayAttendance?.message === "half day" ||
    //   todayAttendance?.message === "absent"
    // ) {
    //   return
    // }
    const status = todayAttendance?.message?.toLowerCase().trim()

    const allowedStatuses = ["checked in", "absent"]

    if (!allowedStatuses.includes(status)) {
      return
    }
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


  return (
    <>
      <FullCalendar
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
          todayDate.setHours(0,0,0,0)
          const cellDate = new Date(arg.date)
          cellDate.setHours(0,0,0,0)
          if (cellDate.getTime() !== todayDate.getTime()) {
            return ["disabled-day"]
          }
          return ["cursor-pointer"]
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Attendance Date: {selectedDate}
            </DialogTitle>
            <DialogDescription className="flex justify-evenly w-full">
              <div
                onClick={checkIn}
                className="cursor-pointer h-30 w-30 mt-3 bg-green-400 rounded-full flex justify-center items-center text-white text-xl"
              >
                Check In
              </div>
              <div
                onClick={checkOut}
                className="cursor-pointer h-30 w-30 mt-3 bg-red-400 rounded-full flex justify-center items-center text-white text-xl"
              >
                Check Out
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
// import React from 'react'
  // import FullCalendar from "@fullcalendar/react"
  // import dayGridPlugin from "@fullcalendar/daygrid"
  // import timeGridPlugin from "@fullcalendar/timegrid"
  // import listPlugin from "@fullcalendar/list"
  // import interactionPlugin from "@fullcalendar/interaction"
  // import { useAttendanceAllQuery, useAttendanceTodayQuery, useHolidaysQuery } from "@/server/queries"
  // import {
  //   Dialog,
  //   DialogContent,
  //   DialogDescription,
  //   DialogHeader,
  //   DialogTitle,
  // } from "@/components/ui/dialog"
  // import { useCheckInMutation, useCheckOutMutation } from '@/server/mutate'


  // export default function AttendanceCalendar() {
  //   const { data: todayAttendance } = useAttendanceTodayQuery()
  //   const { data: allAttendence } = useAttendanceAllQuery()
  //   const { data: allHoliday } = useHolidaysQuery()
  //   const { mutate: checkin } = useCheckInMutation()
  //   const { mutate: checkout } = useCheckOutMutation()
  //   const [selectedDate, setSelectedDate] = React.useState<String>('')
  //   const [dialogOpen, setDialogOpen] = React.useState(false)

  //   console.log(todayAttendance ,'todayAttendance');
  //   console.log(allAttendence ,'allAttendence');
    
  //   let events = []

  //   const today = new Date().toISOString().split("T")[0]

  //   const handleDateClick = (info: any) => {
  //     const today = new Date()
  //     today.setHours(0, 0, 0, 0)
  //     const isHolidays = new Set(
  //       allHoliday?.map((h: any) => h.holiday_date)
  //     )

  //     if (info.date < today || isHolidays.has(info.dateStr)) {
  //       return setDialogOpen(false)
  //     }
  //     if (
  //       todayAttendance?.message === "present" ||
  //       todayAttendance?.message === "half day" ||
  //       todayAttendance?.message === "absent"
  //     ) {
  //       setDialogOpen(false)
  //       return
  //     }
  //     const clickedDate = new Date(info.dateStr)
  //     clickedDate.setHours(0, 0, 0, 0)

  //     if (clickedDate.getTime() !== today.getTime()) {
  //       return // block past and future
  //     }
  //     setDialogOpen(true)
  //     setSelectedDate(info.dateStr)
  //   }

  //   const checkIn = () => {
  //     checkin()
  //     setDialogOpen(false)
  //   }
  //   const checkOut = () => {
  //     checkout()
  //     setDialogOpen(false)
  //   }


  //   if (allAttendence) {
  //     events.push(
  //       ...allAttendence.map((item: any) => ({
  //         title: item.status,
  //         date: item.date,
  //         color:
  //           item.status === "present"
  //             ? "#22c55e"
  //             : item.status === "half day"
  //               ? "#facc15"
  //               : item.status === "pending"
  //                 ? "blue"
  //                 : item.status === "absent"
  //                   ? "#ef4444"
  //                   : "black"
  //       }))
  //     )
  //   }

  //   if (todayAttendance) {
  //     let color = "#ef4444"

  //     if (todayAttendance.message === "Checked In") color = "#7bf1a8"
  //     if (todayAttendance.message === "present") color = "#22c55e"
  //     if (todayAttendance.message === "half day") color = "#facc15"
  //     if (todayAttendance.message === "absent") color = "#ef4444"

  //     events.push({
  //       title: todayAttendance.message,
  //       date: todayAttendance.date ?? today,
  //       color
  //     })
  //   }

  //   if (allHoliday) {
  //     events.push(
  //       ...allHoliday.map((holiday: any) => ({
  //         title: `🎉 ${holiday.title}`,
  //         date: holiday.holiday_date,
  //         backgroundColor: "green",
  //         borderColor: "#88E788"
  //       }))
  //     )
  //   }
  //   return (
  //     <>
  //       <FullCalendar
  //         plugins={[
  //           dayGridPlugin,
  //           timeGridPlugin,
  //           listPlugin,
  //           interactionPlugin
  //         ]}
  //         initialView="dayGridMonth"
  //         headerToolbar={{
  //           left: "prev,next today",
  //           center: "title",
  //           right: "dayGridMonth,listWeek"
  //         }}
  //         events={events}
  //         dateClick={handleDateClick}
  //         height="auto"
  //         selectable={true}
  //         dayCellClassNames={(arg) => {
  //           const today = new Date()
  //           today.setHours(0, 0, 0, 0)

  //           const cellDate = new Date(arg.date)
  //           cellDate.setHours(0, 0, 0, 0)

  //           if (cellDate.getTime() !== today.getTime()) {
  //             return ["disabled-day"]
  //           }

  //           return ["cursor-pointer"]
  //         }}
  //       />
  //       <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
  //         <DialogContent>
  //           <DialogHeader>
  //             <DialogTitle>
  //               Add Attendance Date: {selectedDate}
  //             </DialogTitle>
  //             <DialogDescription className="flex justify-evenly w-full">
  //               <div
  //                 onClick={() => checkIn()}
  //                 className={
  //                   "cursor-pointer h-30 w-30 mt-3 bg-green-300 rounded-full flex justify-center items-center text-white text-2xl"}
  //               >
  //                 Check In
  //               </div>
  //               <div
  //                 onClick={() => checkOut()}
  //                 className={
  //                   "cursor-pointer h-30 w-30 mt-3 bg-red-300 rounded-full flex justify-center items-center text-white text-2xl"}
  //               >
  //                 Check Out
  //               </div>
  //             </DialogDescription>
  //           </DialogHeader>
  //         </DialogContent>
  //       </Dialog>
  //     </>
  //   )
  // }




