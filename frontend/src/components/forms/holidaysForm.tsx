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
import { holidaySchema } from "@/components/forms/validations"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parse } from "date-fns"
import { useholidayMutation } from "@/server/mutate"
import { useStore } from "@tanstack/react-form"
import { Spinner } from "@/components/ui/spinner"
import React from "react"

export type SigninPayload = {
    title: string
    holiday_date: string
}

function HolidayForm({
    className,
    setPopupOpen,
    ...props
}: React.ComponentProps<"div"> & {
    setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [openHolidayDate, setOpenHolidayDate] = React.useState(false)

    const { mutateAsync } = useholidayMutation()
    const form = useForm({
        defaultValues: {
            title: "",
            holiday_date: ""
        },
        validators: {
            onSubmit: holidaySchema,
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
                        name="title"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="title">
                                        Title
                                    </FieldLabel>
                                    <Input
                                        id="title"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="enter title"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="holiday_date"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            const parsedHolidayDate = field.state.value
                                ? parse(field.state.value, "yyyy-MM-dd", new Date())
                                : undefined

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="holiday_date">
                                        Holiday Date
                                    </FieldLabel>
                                    <Popover open={openHolidayDate} onOpenChange={setOpenHolidayDate}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="justify-start">
                                                {parsedHolidayDate
                                                    ? format(parsedHolidayDate, "PPP")
                                                    : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={parsedHolidayDate}
                                                onSelect={(date) => {
                                                    if (!date) return
                                                    const formatted = format(date, "yyyy-MM-dd")
                                                    field.handleChange(formatted)
                                                    setOpenHolidayDate(false)
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
                </FieldGroup>
                <Field>
                    <Button
                        type="submit"
                        form="form_holiday"
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
export default HolidayForm;