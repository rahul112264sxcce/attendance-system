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
import { signinSchema } from "@/components/forms/validations"
import { useSignInMutation } from "@/server/mutate";
import { useStore } from "@tanstack/react-form"
import { Spinner } from "@/components/ui/spinner"

export type SigninPayload = {
  email: string
  password: string
}

function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutateAsync, isError, isSuccess } = useSignInMutation()

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    validators: {
      onSubmit: signinSchema,
    },
    onSubmit: async ({ value }: { value: SigninPayload }) => {
      try {
        await mutateAsync(value)
      } catch (e) {
        console.error(e)
      }
    },
  })
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <>
                      <Field data-invalid={isInvalid}>
                        <div className="flex justify-between">
                          <FieldLabel htmlFor="password" >
                            Password
                          </FieldLabel>
                          <Link
                            to="/forget-password"
                            className="ml-auto inline-block text-sm text-black   hover:underline "
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="enter password"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    </>
                  )
                }}
              />
            </FieldGroup>
            <Field>
              <Button
                type="submit"
                form="form_signin"
                className="mt-4 cursor-pointer "
                disabled={isSubmitting}
              >
                {
                  isSubmitting ?
                    <Spinner data-icon="inline-start" className="text-amber-50 " />
                    :
                    "Sign In"
                }
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link className="text-primary" to="/signup">Sign up</Link>
              </FieldDescription>
            </Field>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
export default SigninForm;