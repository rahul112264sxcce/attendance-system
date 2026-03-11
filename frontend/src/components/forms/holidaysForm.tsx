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
import { format } from "date-fns"
import { useholidayMutation } from "@/server/mutate"

export type SigninPayload = {
    title: string
    holiday_date: string
}

function HolidayForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const { mutate } = useholidayMutation()
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
                mutate(value)
              } catch (e) {
                console.error(e)
              }
        },
    })

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

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="holiday_date">
                                        Holiday Date
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
                </FieldGroup>
                <Field>
                    <Button type="submit" form="form_holiday" className="mt-4 cursor-pointer">Add Holiday</Button>
                </Field>
            </form>
        </div>
    )
}
export default HolidayForm;