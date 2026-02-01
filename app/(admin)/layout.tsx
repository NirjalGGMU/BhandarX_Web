import { getUserData } from "../lib/cookie";
import { redirect } from "next/navigation";
import UserHeader from "../user/_components/Header";    // Reuse user header
import Footer from "../(public)/_components/Footer";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserData();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }
  return (
    <section className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </section>
  );
}