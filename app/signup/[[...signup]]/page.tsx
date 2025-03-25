import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Create a Smart Home Account
        </h1>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground",
              card: "shadow-none",
            },
          }}
          routing="path"
          path="/signup"
          signInUrl="/signin"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
