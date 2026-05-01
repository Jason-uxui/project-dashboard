import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PerformanceContent } from "@/components/performance-content"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Suspense fallback={null}>
          <PerformanceContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
