// app/admin/page.tsx

// page.tsx
export default function Page() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">--</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Active Products</h3>
                    <p className="text-3xl font-bold text-green-600">--</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Stock Movements</h3>
                    <p className="text-3xl font-bold text-purple-600">--</p>
                </div>
            </div>
        </div>
    );
}