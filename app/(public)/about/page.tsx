// // app/(public)/about/page.tsx

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            About BhandarX
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your go-to platform for managing and tracking inventory efficiently from warehouses and products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At BhandarX, we believe efficient inventory management drives business success. We're passionate about connecting businesses with smart tools to track stock, products, and warehouses, making inventory management reliable and delightful.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-xl p-10 text-center">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">500+</div>
            <p className="text-xl mt-2">Warehouses Managed</p>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose BhandarX?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl shadow-md p-8 text-center border border-border">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Fast Tracking</h3>
              <p className="text-muted-foreground">Real-time inventory updates</p>
            </div>
            <div className="bg-card rounded-xl shadow-md p-8 text-center border border-border">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">Wide Variety</h3>
              <p className="text-muted-foreground">From products to warehouses – manage everything</p>
            </div>
            <div className="bg-card rounded-xl shadow-md p-8 text-center border border-border">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
              <p className="text-muted-foreground">Seamless with multiple systems</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-8">Ready to manage your inventory?</p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}





// export default function AboutPage() {
//     return (
//       <div className="max-w-3xl mx-auto space-y-8">
//         <h1 className="text-3xl font-bold text-indigo-600">About BhandarX</h1>
        
//         <section className="space-y-4">
//           <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
//             BhandarX was designed to bridge the gap between traditional store management 
//             and modern digital efficiency. Originally built as a mobile experience, 
//             this web platform provides managers with a powerful dashboard to oversee operations.
//           </p>
//         </section>
  
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
//           <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-indigo-100">
//             <h3 className="font-bold text-indigo-500 mb-2">Our Mission</h3>
//             <p className="text-sm">To provide small and medium businesses with enterprise-grade inventory tools.</p>
//           </div>
//           <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-indigo-100">
//             <h3 className="font-bold text-indigo-500 mb-2">Our Vision</h3>
//             <p className="text-sm">Seamlessly connecting warehouse staff with management through real-time syncing.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }