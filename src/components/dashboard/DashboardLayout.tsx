export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="dashboard-scroll-container"
      className="flex justify-center h-full w-full px-200 md:px-500 overflow-scroll"
    >
      <div className="flex flex-col gap-400 w-full h-fit max-w-[1440px]">
        {children}
      </div>
    </main>
  );
}