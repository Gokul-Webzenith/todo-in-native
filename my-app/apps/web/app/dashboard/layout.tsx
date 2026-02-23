import AppSidebar from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex w-screen min-h-screen">

      {/* Sidebar */}
      <aside className="w-[200px] min-w-[200px] max-w-[200px] border-r bg-white">
        <AppSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto bg-gray-50 p-4">
        {children}
      </main>

    </div>
  )
}