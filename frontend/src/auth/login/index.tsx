import LoginForm from "@/auth/login/components/loginForm";
import PageTitle from "@/helpers/pageTitles/pageTitles";


export default function Login() {
  return (
    <>
      <PageTitle title={"Login"} />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>

  )
}

