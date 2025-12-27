import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-20">
      {/* --- HERO SECTION --- */}
      <section className="flex flex-col items-center text-center pt-10 md:pt-20 px-4">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
          Inventory Management Simplified
        </div>
        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Control your stock with <span className="text-indigo-600">BhandarX</span>
        </h1>
        <p className="max-w-2xl mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400">
          A powerful, intuitive, and real-time inventory system designed to help businesses 
          manage their warehouses, track orders, and grow efficiently.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href="/register"
            className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            Create Free Account
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 text-lg font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
          >
            How it Works
          </Link>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Built for Efficiency</h2>
          <p className="text-gray-500 mt-2">Everything you need to manage your store in one place</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-2xl mb-6">
              📊
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Real-time Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get instant insights into your stock levels, sales trends, and warehouse performance.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-2xl mb-6">
              🔔
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Low Stock Alerts</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Never run out of items. Receive automated notifications when it's time to reorder.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-2xl mb-6">
              📱
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Multi-Device Sync</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access your data from anywhere. Seamlessly sync between your mobile app and web dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="bg-indigo-600 rounded-3xl p-12 text-center text-white mx-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl font-bold">10k+</div>
            <div className="text-indigo-100 text-sm">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold">500+</div>
            <div className="text-indigo-100 text-sm">Warehouses</div>
          </div>
          <div>
            <div className="text-4xl font-bold">99.9%</div>
            <div className="text-indigo-100 text-sm">Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold">24/7</div>
            <div className="text-indigo-100 text-sm">Support</div>
          </div>
        </div>
      </section>
    </div>
  );
}