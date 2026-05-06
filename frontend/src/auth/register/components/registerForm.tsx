"use client";
import React from "react"
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { registerSchema, type registerPayload } from "@/helpers/validation/validations";
import { useRegisterMutation } from "@/auth/hooks/useAuthHooks";
import { Eye, EyeOff } from 'lucide-react';

function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { mutateAsync } = useRegisterMutation();
  const [showpassword, setShowPassword] = React.useState<boolean>(false)
  const [confirmshowpassword, setConfirmShowPassword] = React.useState<boolean>(false)

  const form = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      cpassword: "",
    } as registerPayload,
    validators: {
      onBlur: registerSchema,
    },
    onSubmit: async ({ value }) => {
      const { cpassword, ...payload } = value;
      await mutateAsync(payload);
    },
  });

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Fill up the form for your new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="form_signup"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="gap-4">
              <div className="grid grid-cols-2 gap-4">
                <form.Field name="firstname">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>First Name</FieldLabel>
                        <Input
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
                    );
                  }}
                </form.Field>
                <form.Field name="lastname">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>Last Name</FieldLabel>
                        <Input
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
                    );
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
                          </div>
                          <div className="relative">
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
                            {
                              showpassword ?
                                <Eye
                                  className="absolute right-4 top-2.5 cursor-pointer w-4 h-4"
                                  onClick={() => setShowPassword((params) => (!params))}
                                />
                                :
                                <EyeOff
                                  className="absolute right-4 top-2.5 cursor-pointer w-4 h-4"
                                  onClick={() => setShowPassword((params) => (!params))}
                                />
                            }
                          </div>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      </>
                    )
                  }}
                />
                <form.Field name="cpassword">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <div className="flex justify-between">
                          <FieldLabel>Confirm Password</FieldLabel>
                        </div>
                        <div className="relative">
                        <Input
                          type={confirmshowpassword ? "text" : "password"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value)
                          }
                          aria-invalid={isInvalid}
                          placeholder="enter confirm password"
                        />
                         {
                            confirmshowpassword ?
                              <Eye
                                className="absolute right-4 top-2.5 cursor-pointer w-4 h-4"
                                onClick={() => setConfirmShowPassword((params) => (!params))}
                              />
                              :
                              <EyeOff
                                className="absolute right-4 top-2.5 cursor-pointer w-4 h-4"
                                onClick={() => setConfirmShowPassword((params) => (!params))}
                              />
                          }
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </FieldGroup>
            <Field>
              <Button
                type="submit"
                form="form_signup"
                className="mt-4 cursor-pointer"
                disabled={isSubmitting}
              >
                {
                  isSubmitting ?
                    <Spinner data-icon="inline-start" className="text-amber-50 " />
                    : "Register Now"
                }
              </Button>
              <FieldDescription className="text-center">
                Already have an account?
                <Link className="text-primary" to="/login">
                  {" "}Login Now
                </Link>
              </FieldDescription>
            </Field>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterForm;