import { Footer } from "@/components/layout/footer/Footer";
import { MainNav } from "@/components/navigation/NavBar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
