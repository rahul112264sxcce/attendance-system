"use client"
import React from "react"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError
} from "@/components/ui/field"
import { leavesSchema } from "@/helpers/validation/validations"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { useStore } from "@tanstack/react-form"
import { Spinner } from "@/components/ui/spinner"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useLeaveReqMutation } from "../hooks/useLeaveRequestHooks"

export type SigninPayload = {
    leave_type: string
    holiday_date: string
}

function LeavesForm({
    className,
    setPopupOpen,
    ...props
}: React.ComponentProps<"div"> & {
    setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {

    const [openStart, setOpenStart] = React.useState(false)
    const [openEnd, setOpenEnd] = React.useState(false)

    const { mutateAsync } = useLeaveReqMutation()

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
                await mutateAsync(value)
                form.reset()
                setPopupOpen(false)
            } catch (e) {
                console.error(e)
            }
        },
    })

    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
    const leaveTypes = ["sick", "casual", "annual", "unpaid", "maternity", "paternity", "bereavement"]

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form
                id="form_leave_req"
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <FieldGroup className="gap-4">
                    <form.Field
                        name="leave_type"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field  data-invalid={isInvalid} >
                                    <FieldLabel>Leave Type</FieldLabel>
                                    <Select
                                        onValueChange={(value) => field.handleChange(value)}
                                    >
                                        <SelectTrigger className="w-full lg:max-w-84 md:w-full">
                                            <SelectValue placeholder="Select a leave type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    leaveTypes?.map((value, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <SelectItem key={index} value={value}>{value}</SelectItem>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="start_date"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="start_date">
                                        Start Date
                                    </FieldLabel>

                                    <Popover open={openStart} onOpenChange={setOpenStart}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="justify-start">
                                                {field.state.value
                                                    ? format(new Date(field.state.value), "PPP")
                                                    : "pick  start date"}
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
                                                    const formatted = format(date, "yyyy-MM-dd")
                                                    field.handleChange(formatted)
                                                    setOpenStart(false)
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
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="end_date">
                                        End Date
                                    </FieldLabel>
                                    <Popover open={openEnd} onOpenChange={setOpenEnd}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="justify-start">
                                                {field.state.value
                                                    ? format(new Date(field.state.value), "PPP")
                                                    : "pick end date"}
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
                                                    const formatted = format(date, "yyyy-MM-dd")
                                                    field.handleChange(formatted)
                                                    setOpenEnd(false)
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

                                    <Textarea
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
                    <Button
                        type="submit"
                        form="form_leave_req"
                        className="mt-4 cursor-pointer"
                        disabled={isSubmitting}
                    >
                        {
                            isSubmitting ?
                                <Spinner data-icon="inline-start" />
                                :
                                "Add Holiday"
                        }
                    </Button>
                </Field>
            </form>
        </div>
    )
}
export default LeavesForm;