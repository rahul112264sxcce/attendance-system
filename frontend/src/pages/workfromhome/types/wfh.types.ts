export type WFH = {
  id: number
  start_date: string
  end_date: string
  reason?: string
  status: "pending" | "approved" | "rejected"
  employee_name: string
  employee_id: string
  created_at: string
}

export type WorkFromHomeTableProps = {
  tableData: WFH[]
}

export type WorkFromHomeDataResponse = {
  data: WFH[]
}

export type workFromHomePayload = {
  start_date: string
  end_date: string
  reason?: string
}

export type workFromHomeResponse = {
  message: string
}

export type WFHStatus = "pending" | "approved" | "rejected"

export type UpdateStatusPayload = {
  id: number
  status: WFHStatus
}

export type UpdateStatusResponse = {
  message: string
}

export type WorkFromHomeDialogProps = {
  open: boolean
   setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
}