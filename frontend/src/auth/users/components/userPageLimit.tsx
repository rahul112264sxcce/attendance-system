import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Field, FieldLabel } from "@/components/ui/field"

type UserPageLimitProps = {
    total:number
    limit: number
    setLimit: React.Dispatch<React.SetStateAction<number>>
}

const UserPageLimit = ({ limit, setLimit ,total}: UserPageLimitProps) => {

    const limitOptions =
        total > 0
            ? Array.from(
                { length: Math.ceil(total / 10) },
                (_, i) => (i + 1) * 10
            )
            : [10]
    return (
        <Field orientation="horizontal">
            <FieldLabel htmlFor="select-rows-per-page" className="flex justify-end">
                Rows per page
            </FieldLabel>
            <Select
                value={String(limit)}
                onValueChange={(value: string) => {
                    setLimit(Number(value))
                }}
            >
                <SelectTrigger className="w-20" id="select-rows-per-page">
                    <SelectValue />
                </SelectTrigger>

                <SelectContent align="start">
                    <SelectGroup>
                        {limitOptions.map((value, index) => (
                            <SelectItem key={index} value={String(value)}>
                                {value}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </Field>
    )
}

export default UserPageLimit