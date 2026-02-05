// app/admin/users.not_found.tsx

// loading.tsx
export function Loading() {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
        </div>
    );
}

// error.tsx
"use client";
import { useEffect } from "react";

export function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <button
                onClick={reset}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Try again
            </button>
        </div>
    );
}

// not-found.tsx
export function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-2xl font-bold mb-4">404 - Not Found</h2>
            <p className="text-muted-foreground">The requested resource was not found.</p>
        </div>
    );
}
