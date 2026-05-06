import React from 'react'
import { useSearchParams } from "react-router-dom"
import type { AxiosError } from 'axios'

import { useUsersQuery } from '@/auth/hooks/useAuthHooks'
import UsersTable from '@/auth/users/components/usersTable'
import { handleApiError } from '@/helpers/apierrors/handleApiError'
import { UserFilter } from './components/userFilter'
import UserPagination from './components/userPagination'
import PageTitle from '@/helpers/pageTitles/pageTitles'
import UserPageLimit from './components/userPageLimit'

function Users() {

    const prevSearch = React.useRef("")
    const prevLimit = React.useRef<number | null>(null)
    const prevOrder = React.useRef<"asc" | "desc" | null>(null)

    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = React.useState("")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")
    const [limit, setLimit] = React.useState(10)
    const [order, setOrder] = React.useState<"asc" | "desc">("asc")

    
    const page = Math.max(1, Number(searchParams.get("page")) || 1)

    const { data, error, isLoading, isFetching } = useUsersQuery({
        page,
        limit,
        search: debouncedSearch,
        order
    })

    
    const setPage = (newPage: number) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev)
            params.set("page", newPage.toString())
            return params
        })
    }

   
    React.useEffect(() => {
        if (prevSearch.current !== debouncedSearch) {
            setPage(1)
            prevSearch.current = debouncedSearch
        }
    }, [debouncedSearch])

    
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 1000)

        return () => clearTimeout(timer)
    }, [search])

    
    React.useEffect(() => {
        if (prevLimit.current !== null && prevLimit.current !== limit) {
            setPage(1)
        }
        prevLimit.current = limit
    }, [limit])

   
    React.useEffect(() => {
        if (prevOrder.current !== null && prevOrder.current !== order) {
            setPage(1)
        }
        prevOrder.current = order
    }, [order])

    
    React.useEffect(() => {
        if (error) {
            handleApiError(error as AxiosError)
        }
    }, [error])

    return (
        <>
            <PageTitle title={"Employees"} />

            <div className='w-full'>

                <div className="grid grid-cols-12 gap-4">
                    <div className='col-span-4 mb-4'>
                        <UserFilter
                            search={search}
                            setSearch={setSearch}
                        />
                    </div>
                </div>

                <div className='[&>div]:rounded-sm [&>div]:border'>
                    <UsersTable
                        users={data?.users || []}
                        loading={isLoading}
                        setOrder={setOrder}
                        noUser={data?.users?.length === 0 ? true : undefined}
                    />
                </div>

                <div className='flex items-center mt-3 gap-4 justify-start'>
                    {data?.users?.length !== 0 && (
                        <UserPageLimit
                            total={data?.pagination?.total ?? 0}
                            limit={limit}
                            setLimit={setLimit}
                        />
                    )}

                    <UserPagination
                        page={page}
                        setPage={setPage}
                        fetching={isFetching}
                        total={data?.pagination?.total ?? 0}
                        has_prev={data?.pagination?.has_prev}
                        has_next={data?.pagination?.has_next}
                        limit={limit}
                    />

                </div>
            </div>
        </>
    )
}

export default Users

