// app/admin/users/error.tsx

"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Error in admin users page:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
            <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                <div className="mb-4">
                    <svg
                        className="mx-auto h-12 w-12 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                    Something went wrong!
                </h2>
                <p className="text-sm text-red-600 dark:text-red-400 mb-6">
                    {error.message || "An unexpected error occurred while loading users."}
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}