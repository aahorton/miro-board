import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";
import { AuthLayout } from "./ui/auth-layout";
import { LoginForm } from "./ui/login-form";

function LoginPage() {
  return (
    <AuthLayout
      title="Sign In"
      description="Enter your email and password to sign in"
      form={<LoginForm />}
      footerText={
        <>
          Don't have an account? <Link to={ROUTES.REGISTER}>Sign up</Link>
        </>
      }
    />
  );
}
export const Component = LoginPage;
