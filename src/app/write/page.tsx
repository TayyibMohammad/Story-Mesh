import AuthForm from "~/components/AuthForm"

export default function SignUp() {
    return (
        <div>
            <AuthForm isSignIn={false}></AuthForm>
        </div>
    )
}