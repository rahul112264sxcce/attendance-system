import ForgetForm from "@/auth/forget/components/forgetForm";
import PageTitle from "@/helpers/pageTitles/pageTitles";


export default function ForgetPassword() {
  return (
    <>
      <PageTitle title={"Forget Password"} />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
            <ForgetForm />
        </div>
      </div>
    </>

  )
}

