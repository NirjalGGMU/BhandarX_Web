// app/(public)/about/page.tsx

export default function AboutPage() {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-indigo-600">About BhandarX</h1>
        
        <section className="space-y-4">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            BhandarX was designed to bridge the gap between traditional store management 
            and modern digital efficiency. Originally built as a mobile experience, 
            this web platform provides managers with a powerful dashboard to oversee operations.
          </p>
        </section>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-indigo-100">
            <h3 className="font-bold text-indigo-500 mb-2">Our Mission</h3>
            <p className="text-sm">To provide small and medium businesses with enterprise-grade inventory tools.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-indigo-100">
            <h3 className="font-bold text-indigo-500 mb-2">Our Vision</h3>
            <p className="text-sm">Seamlessly connecting warehouse staff with management through real-time syncing.</p>
          </div>
        </div>
      </div>
    );
  }