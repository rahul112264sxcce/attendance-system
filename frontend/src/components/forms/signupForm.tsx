"use client"
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldError
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signupSchema } from "@/components/forms/validations"
import { useSignUpMutation } from "@/server/mutate";


export type SignupPayload = {
    firstname: string
    lastname: string
    email: string
    password: string
}

function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    
    const { mutate, isPending, isError, isSuccess } = useSignUpMutation()

    const form = useForm({
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            cpassword: ""
        },
        validators: {
            onSubmit: signupSchema,
        },
        onSubmit: async ({ value }: { value: SignupPayload }) => {
            try {
                const { firstname, lastname, email, password } = value
                const payload = { firstname ,lastname, email, password }
                mutate(payload)
            } catch (e) {
                console.error(e)
            }
        },
    })
    return (
        <div className={cn("flex flex-col gap-6 ", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create to your account</CardTitle>
                    <CardDescription>
                        Fill up the form for your new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="form_signin"
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}
                    >
                        <FieldGroup className="gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <form.Field name="firstname">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor="firstname">First Name</FieldLabel>
                                                <Input
                                                    id="firstname"
                                                    type="text"
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value)
                                                    }
                                                    aria-invalid={isInvalid}
                                                    placeholder="enter first name"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                </form.Field>
                                <form.Field name="lastname">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                                                <Input
                                                    id="lastname"
                                                    type="text"
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value)
                                                    }
                                                    aria-invalid={isInvalid}
                                                    placeholder="enter last name"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                </form.Field>
                            </div>
                            <form.Field
                                name="email"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor="email">
                                                Email
                                            </FieldLabel>
                                            <Input
                                                id="email"
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="enter email"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )
                                }}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <form.Field name="password">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value)
                                                    }
                                                    aria-invalid={isInvalid}
                                                    placeholder="enter password"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                </form.Field>
                                <form.Field name="cpassword"

                                >
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor="cpassword">Confirm Password</FieldLabel>
                                                <Input
                                                    id="cpassword"
                                                    type="password"
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) =>
                                                        field.handleChange(e.target.value)
                                                    }
                                                    aria-invalid={isInvalid}
                                                    placeholder="enter confirm password"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                </form.Field>
                            </div>
                        </FieldGroup>
                        <Field>
                            <Button
                                type="submit"
                                form="form_signin"
                                className="mt-4 cursor-pointer"
                            >
                                Sign Up
                            </Button>
                            <FieldDescription className="text-center">
                                Do you have an account?
                                <Link className="text-primary" to="/signin">Sign In</Link>
                            </FieldDescription>
                        </Field>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
export default SignupForm;