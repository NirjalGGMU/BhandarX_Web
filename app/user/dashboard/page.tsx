import Link from "next/link";
import { getUserData } from "@/app/lib/cookie";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUserData();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        {/* Welcome Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Welcome Back, {user.name || user.email}! 🎉
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            You're successfully logged in. Here's your dashboard overview.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border mb-12">
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-semibold">{user.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-semibold">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">Role:</span>
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-2xl p-10 text-white text-center hover:scale-105 transition-transform">
            <h3 className="text-5xl font-bold">42</h3>
            <p className="text-xl mt-4 opacity-90">Stock Movements This Month</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl shadow-2xl p-10 text-white text-center hover:scale-105 transition-transform">
            <h3 className="text-5xl font-bold">18</h3>
            <p className="text-xl mt-4 opacity-90">Top Products</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl shadow-2xl p-10 text-white text-center hover:scale-105 transition-transform">
            <h3 className="text-5xl font-bold">95%</h3>
            <p className="text-xl mt-4 opacity-90">Efficiency Rate</p>
          </div>
        </div>

        <div className="bg-card rounded-3xl shadow-xl p-10 border border-border">
          <h2 className="text-3xl font-bold mb-8 text-center">Recent Activity</h2>
          <p className="text-center text-muted-foreground text-lg">Your recent stock updates will appear here once you start managing!</p>
        </div>
      </div>
    </div>
  );
}