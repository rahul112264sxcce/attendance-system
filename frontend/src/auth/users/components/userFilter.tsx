
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { userFilterProps } from "../types/users.types"

export const UserFilter = ({ search, setSearch }: userFilterProps) => {
    return (
        <Field orientation="horizontal">
            <Input
                type="search"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                }}
                className=" focus:border-sky-500 focus:outline focus:outline-sky-500"
                placeholder="Search..."
            />
        </Field>
    )
}


