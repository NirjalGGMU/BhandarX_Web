import LoginForm from "./components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your inventory</p>
        </div>

        {/* This is the component you built earlier */}
        <LoginForm />

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}