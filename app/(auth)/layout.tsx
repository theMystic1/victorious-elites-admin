import AuthLayout from "@/components/ui/layouts/auth-layout";

const AuthLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default AuthLayoutWrapper;
