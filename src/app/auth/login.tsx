import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
      <h2 className="text-xl font-semibold mb-2">Sign in to your account</h2>
      <button
        className="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 mb-2"
        onClick={() => signIn("google")}
      >
        Continue with Google
      </button>
      <button
        className="w-full max-w-xs bg-blue-700 hover:bg-blue-800 text-white rounded px-4 py-2"
        onClick={() => signIn("facebook")}
      >
        Continue with Facebook
      </button>
    </div>
  );
}
