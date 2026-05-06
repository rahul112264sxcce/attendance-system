export type Users = {
    id: number | string
    employee_id: string
    first_name: string
    last_name: string
    email: string
    role: string
    status: string
}

export type UsersTableProps = {
    users: Users[]
    loading: boolean
    setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>
    noUser: boolean | undefined
}

export type UsersResponse = {
    users: Users[];
    pagination: {
        total: number
        total_pages: number
        has_next: boolean
        has_prev: boolean
        // "is_first": page == 1,
        // "is_last": page == total_pages
    }

}

export interface userFilterProps {
    search: string
    setSearch: (value: string) => void
}

export type GetUsersParams = {
    page?: number
    limit?: number
    search?: string
    //   sort_by?: string
    order?: "asc" | "desc"
}

export type PaginationProps = {
    page: number
    setPage: (page: number) => void
    fetching: boolean
    total: number
    has_prev: boolean | undefined
    has_next: boolean | undefined
    limit: number
}