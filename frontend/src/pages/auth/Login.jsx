import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

function Login() {
  return (
    <AuthLayout
      title="Welcome Back 👋"
      subtitle="Sign in to continue managing your finances."
      footerText="Don't have an account?"
      footerLinkText="Create Account"
      footerLink="/register"
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;