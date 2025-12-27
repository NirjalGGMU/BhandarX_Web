
import RegisterForm from "./components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Join BhandarX</h1>
          <p className="text-gray-500 mt-2">Start managing your stock efficiently</p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}



