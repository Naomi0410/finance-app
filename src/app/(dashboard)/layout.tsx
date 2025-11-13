import Sidebar from "@/components/layout/Sidebar";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <main className="flex flex-col-reverse justify-end lg:flex-row h-full">
      <Sidebar />
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </main>
  );
}