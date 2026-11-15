import AuthLayout from "../../components/auth/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

function Register() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your bills, expenses, and budgets with AI."
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLink="/login"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;
