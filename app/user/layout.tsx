import UserHeader from "./_components/Header";
import Footer from "../(public)/_components/Footer";  // Import from public
import { getUserData } from "@/app/lib/cookie"; // Adjust the path if necessary
import { redirect } from "next/navigation";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserData();
  if (!user) {
    redirect("/login");
  }
  return (
    <section className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-1">{children}</main>
      <Footer />  // Added footer
    </section>
  );
}



// import UserHeader from "./_components/Header";

// export default function UserLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <section className="min-h-screen flex flex-col">
//       <UserHeader />
//       <main className="flex-1">{children}</main>
//     </section>
//   );
// }