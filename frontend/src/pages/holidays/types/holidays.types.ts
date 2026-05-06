export type holidaysPayload = {
  title: string
  holiday_date: string
}

export type holidays = {
  id: number
  holiday_name: string
  holiday_date: string
  created_at: string
}


export type holidaysResponse = {
  data: holidays[]
}

export type holidaysDialogProps = {
  open:boolean
  setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
}