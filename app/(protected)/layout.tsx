import { HomeProtectedLayout } from "@/components/layout/home-connection/HomeProtectedLayout";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <HomeProtectedLayout>{children}</HomeProtectedLayout>;
}
