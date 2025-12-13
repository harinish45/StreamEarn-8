
import { AppSidebar } from "./components/AppSidebar";
import { Header } from "./components/Header";

export default function BlitzitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0F172A] text-[#E2E8F0]">
        <div className="flex flex-1">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    </div>
  );
}
