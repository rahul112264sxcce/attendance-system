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
import { workfromhomeSchema } from "@/helpers/validation/validations"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@tanstack/react-form"
import { Spinner } from "@/components/ui/spinner"
import type { workFromHomePayload } from "../types/wfh.types"
import { useWorkFromHomeMutation } from "../hooks/useWfhHooks"


function WorkFromHomeForm({
    className,
    setPopupOpen,
    ...props
}: React.ComponentProps<"div"> & {
    setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [openStart, setOpenStart] = React.useState(false)
    const [openEnd, setOpenEnd] = React.useState(false)
    const { mutateAsync } = useWorkFromHomeMutation()
    const form = useForm({
        defaultValues: {
            start_date: "",
            end_date: "",
            reason: ""
        } as workFromHomePayload,
        validators: {
            onSubmit: workfromhomeSchema,
        },
        onSubmit: async ({ value }) => {
            await mutateAsync(value)
            setPopupOpen(false)

        },
    })
    const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form
                id="form_workhome"
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <FieldGroup className="gap-4">
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
                                            <Button variant="outline" className="justify-start" aria-invalid={isInvalid}>
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
                                            <Button variant="outline" className="justify-start" aria-invalid={isInvalid}>
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
                                        aria-invalid={isInvalid}
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
                        form="form_workhome"
                        className="mt-4 cursor-pointer"
                        disabled={isSubmitting}
                    >
                        {
                            isSubmitting ?
                                <Spinner data-icon="inline-start" />
                                :
                                "Add Wrok  Home"
                        }
                    </Button>
                </Field>
            </form>
        </div>
    )
}
export default WorkFromHomeForm;