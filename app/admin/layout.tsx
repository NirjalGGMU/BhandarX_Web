// app/admin/layout.tsx


// layout.tsx
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { getUserData } from "../lib/cookie";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await getUserData();
    
    if (!user) {
        redirect('/login');
    }
    
    if (user.role !== 'admin') {
        redirect('/user/dashboard');
    }

    return (
        <div className='flex w-full min-h-screen'>
            <div className='page-wrapper flex w-full'>
                <div className='xl:block hidden'>
                    <Sidebar />
                </div>
                <div className='w-full bg-background'>
                    <Header />
                    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 p-2">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
