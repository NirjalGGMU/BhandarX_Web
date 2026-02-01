import UserHeader from "./_components/Header";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-1">{children}</main>
    </section>
  );
}