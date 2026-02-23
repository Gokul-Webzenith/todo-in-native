"use client";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button"; 

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">

       
        <h1 className="text-4xl font-bold">
          Work Track
        </h1>

       
        <p className="text-gray-500 text-lg">
          This is a work tracker
        </p>

        
        <div className="flex justify-center gap-4 pt-4">

          <Link href="/work">
            <Button>
              Work
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline">
              Dashboard
            </Button>
          </Link>

        </div>

      </div>
    </div>
  );
}
