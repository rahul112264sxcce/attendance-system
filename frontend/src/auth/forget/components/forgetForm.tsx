import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { forgetPasswordSchema } from "@/helpers/validation/validations"
import { cn } from "@/lib/utils"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError
} from "@/components/ui/field"
import { useForm, useStore } from "@tanstack/react-form"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
function ForgetForm({
  className,
  ...props
}: React.ComponentProps<"div">) {


  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    }as any,
    validators: {
      onChange: forgetPasswordSchema,
    },
    // onSubmit: async ({ value }) => {
    //   await mutateAsync(value)
    // },
  })

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forget Password </CardTitle>
          <CardDescription>
            Enter your email below to reset your password
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
             
            </FieldGroup>
            <Field>
              <Button
                type="submit"
                form="form_signin"
                className="mt-4 cursor-pointer text-trim-both text-white bg-primary "
                disabled={isSubmitting}
              >
                {
                  isSubmitting ?
                    <Spinner data-icon="inline-start" className="text-amber-50 " />
                    :
                    "Next"
                }
                
              </Button>
             
            </Field>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
export default ForgetForm;