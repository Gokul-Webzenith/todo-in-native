import { Providers } from "@/components/providers"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

import "@workspace/ui/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>

        <Providers>
          <TooltipProvider>

            {/* No Sidebar Here */}
            <main className="min-h-screen w-screen bg-gray-50">
              {children}
            </main>

          </TooltipProvider>
        </Providers>

      </body>
    </html>
  )
}