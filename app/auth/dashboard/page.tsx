import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Main Title */}
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
        Dashboard
      </h1>

      {/* Success Message */}
      <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-4">
        Congratulations! You are now logged in.
      </p>

      {/* Description */}
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-10">
        This is a dummy page.
      </p>

      {/* Navigation Button */}
      <Link
        href="/"
        className="px-8 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
}