export type leaveReqResponse = {
  message: string
}

export type LeaveRequestItem = {
  id: number
  employee_id: string
  first_name: string
  last_name: string
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export type LeaveReqResponse = LeaveRequestItem[]


export type CreateLeavePayload = {
  leave_type: "sick" | "casual" | "annual" | "unpaid" | "maternity" | "paternity" | "bereavement"
  start_date: string   // YYYY-MM-DD
  end_date: string
  reason: string
}


export type LeaveStatusPayload = {
  id: number
  status: "approved" | "rejected"
}