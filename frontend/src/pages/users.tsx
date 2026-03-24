import React from 'react'
import type { AxiosError } from 'axios'
import { useUsersQuery } from '@/server/queries'
import { toast } from "sonner"
import UsersTable from '@/components/tables/usersTable'

function Users() {


    const { data, error } = useUsersQuery()
    const users = Array.isArray(data) ? data : data ? [data] : []

    React.useEffect(() => {
        if (error) {
            const err = error as AxiosError<any>;
            const message =
                err?.response?.data?.detail ||
                err.message;
            toast.error(message);
        }
    }, [error]);
    return (
        <>
            <div className='w-full'>
                <div className='[&>div]:rounded-sm [&>div]:border'>
                        <UsersTable users={users} />
                </div>
            </div>
        </>
    )
}

export default Users