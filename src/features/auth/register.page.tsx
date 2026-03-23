import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";
import { AuthLayout } from "./ui/auth-layout";
import { RegisterForm } from "./ui/register-form";

function RegisterPage() {
  return (
    <AuthLayout
      title="Sign Up"
      description="Enter your email and password to register in the system"
      form={<RegisterForm />}
      footerText={
        <>
          Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
        </>
      }
    />
  );
}

export const Component = RegisterPage;
