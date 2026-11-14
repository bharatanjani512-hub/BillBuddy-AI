import AuthLayout from "../../components/auth/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

function Register() {
  return (
    <AuthLayout
      title="Create Account 🚀"
      subtitle="Start managing your business and personal bills smarter with AI."
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLink="/login"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;
