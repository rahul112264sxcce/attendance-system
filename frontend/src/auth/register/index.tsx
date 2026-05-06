import RegisterForm from "@/auth/register/components/registerForm";
import PageTitle from "@/helpers/pageTitles/pageTitles";

export default function Regiter() {
    return (
        <>
            <PageTitle title={"Register"} />
            <div className="flex min-h-svh w-full items-center justify-center p-6">
                <div className="w-full max-w-lg">
                    <RegisterForm />
                </div>
            </div>
        </>
    )
}

