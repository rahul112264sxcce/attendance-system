"use client"
import React from "react"
import { Link } from "react-router-dom";
import { loginSchema, type LoginPayload } from "@/helpers/validation/validations"
import { useForm } from "@tanstack/react-form"
import { useGetTranslations, useLoginMutation } from "@/auth/hooks/useAuthHooks";
import { useStore } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOffIcon} from 'lucide-react';

function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { mutateAsync } = useLoginMutation()
  const [showpassword, setShowPassword] = React.useState<boolean>(false)
  const { refetch } = useGetTranslations()
    const form = useForm({
      defaultValues: {
        email: "",
        password: ""
      } as LoginPayload,
      validators: {
        onBlur: loginSchema,
      },
      onSubmit: async ({ value }) => {
        await mutateAsync(value)
        await refetch()
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
                            className="ml-auto inline-block text-sm text-black   hover:underline hover:text-primary "
                          >
                            forget password?
                          </Link>
                        </div>
                        <div className="relative">
                          {
                            showpassword ?
                              <Eye
                              className="absolute right-4 top-2.5 cursor-pointer w-4 h-4"
                              onClick={() => setShowPassword((params) => (!params))}
                              />
                              :
                              <EyeOffIcon 
                                className="absolute right-4 top-2.5 cursor-pointer w-4 h-4"
                                onClick={() => setShowPassword((params) => (!params))}
                              />
                          }
                          <Input
                            id="password"
                            type={showpassword ? "text" : "password"}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="enter password"
                          />
                        </div>
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
                className="mt-4 cursor-pointer text-trim-both text-white"
                disabled={isSubmitting}
              >
                {
                  isSubmitting ?
                    <Spinner data-icon="inline-start" className="text-amber-50 " />
                    :
                    "Login Now"
                }
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account?
                <Link className="text-primary ml-1" to="/register">
                  Register now
                </Link>
              </FieldDescription>
            </Field>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
export default LoginForm;