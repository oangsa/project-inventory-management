import { Layout } from "@/components/layouts/layout";
import "../globals.css";

export default function RootLayout({ children }: {  children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
