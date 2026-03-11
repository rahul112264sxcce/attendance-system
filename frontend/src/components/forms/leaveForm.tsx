"use client"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { leavesSchema } from "@/components/forms/validations"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import { format } from "date-fns"
import { useholidayMutation } from "@/server/mutate"

export type SigninPayload = {
    leave_type: string
    holiday_date: string
}

function LeavesForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const { mutate } = useholidayMutation()
    const form = useForm({
        defaultValues: {
            leave_type: "",
            start_date: "",
            end_date: "",
            reason: "",
        },
        validators: {
            onSubmit: leavesSchema,
        },
        onSubmit: async ({ value }: { value: any }) => {
            try {
                mutate(value)
            } catch (e) {
                console.error(e)
            }
        },
    })
    const leaveTypes = ["sick_leave", "casual_leave", "annual_leave", "unpaid_leave", "maternity_leave", "paternity_leave", "bereavement_leave"]
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form
                id="form_holiday"
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <FieldGroup className="gap-4">
                    <form.Field
                        name="leave_type"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel>Leave Type</FieldLabel>
                                    {/* <Combobox
                                        items={leaveTypes}
                                        value={field.state.value}
                                        onValueChange={(value) => field.handleChange(value)}
                                    >
                                        <ComboboxInput
                                            placeholder="Select leave type"
                                            value={
                                                field.state.value
                                                    ? field.state.value.replace(/_/g, " ")
                                                    : ""
                                            }
                                        />

                                        <ComboboxContent>
                                            <ComboboxEmpty>No leave type found.</ComboboxEmpty>

                                            <ComboboxList>
                                                {(item) => (
                                                    <ComboboxItem key={item} value={item}>
                                                        {item.replace(/_/g, " ")}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox> */}
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="start_date"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="start_date">
                                        Start Date
                                    </FieldLabel>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="justify-start">
                                                {field.state.value
                                                    ? format(new Date(field.state.value), "PPP")
                                                    : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    field.state.value
                                                        ? new Date(field.state.value)
                                                        : undefined
                                                }
                                                onSelect={(date) => {
                                                    if (!date) return

                                                    const formatted =
                                                        date.toISOString().split("T")[0]

                                                    field.handleChange(formatted)
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="end_date"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="end_date">
                                        End Date
                                    </FieldLabel>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="justify-start">
                                                {field.state.value
                                                    ? format(new Date(field.state.value), "PPP")
                                                    : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    field.state.value
                                                        ? new Date(field.state.value)
                                                        : undefined
                                                }
                                                onSelect={(date) => {
                                                    if (!date) return

                                                    const formatted =
                                                        date.toISOString().split("T")[0]

                                                    field.handleChange(formatted)
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="reason"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="reason">
                                        Reason
                                    </FieldLabel>

                                    <Input
                                        id="reason"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Enter reason"
                                    />

                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                </FieldGroup>
                <Field>
                    <Button type="submit" form="form_holiday" className="mt-4 cursor-pointer">Add Holiday</Button>
                </Field>
            </form>
        </div>
    )
}
export default LeavesForm;