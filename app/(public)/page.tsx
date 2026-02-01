import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        {/* Welcome Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Welcome To BhandarX! 🎉
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Register now for efficient inventory management. Here's your overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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
          <p className="text-center text-muted-foreground text-lg">(Dummy content – your recent stock updates would show here in a real app!)</p>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/register"
            className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition shadow-xl"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}