export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  user_id: string
  email: string
  role: string
  access_token: string
  message: string
}