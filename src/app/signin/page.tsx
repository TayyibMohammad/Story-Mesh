import AuthForm from "~/components/AuthForm"

export default function SignIn() {
    return (
        <div>
            <AuthForm isSignIn={true}></AuthForm>
        </div>
    )
}