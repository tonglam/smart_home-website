import { SignIn } from "@clerk/nextjs";

const SignInForm = () => (
  <SignIn
    appearance={{
      elements: {
        formButtonPrimary:
          "bg-primary hover:bg-primary/90 text-primary-foreground",
        card: "shadow-xl w-full",
      },
    }}
    routing="path"
    path="/signin"
    signUpUrl="/signup"
    fallbackRedirectUrl="/dashboard"
  />
);

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <SignInForm />
    </div>
  );
}
