import Navbar from "@/components/docs/navbar";
import { ScrollArea } from "@/components/dashboard/scroll-area";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <Navbar />
      <ScrollArea>{children}</ScrollArea>
    </div>
  );
}
