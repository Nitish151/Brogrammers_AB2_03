"use client"; // This file can use hooks like usePathname

import { usePathname } from "next/navigation";
import Navbar from "@/Components/Navbar/Navbar";
import Sidebar from "@/Components/Sidebar/Sidebar";

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/signin" || pathname === "/signup"; // Hide Navbar & Sidebar on auth pages

  return (
    <div>
      {/* Show Navbar only on non-auth pages */}
      {!isAuthPage && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
      )}

      <div className="flex">
        {/* Show Sidebar only on non-auth pages */}
        {!isAuthPage && (
          <div className="fixed top-0 left-0 w-64 h-full bg-gray-100 shadow-md">
            <Sidebar />
          </div>
        )}

        {/* Main Content - Adjust margin for sidebar */}
        <div className={`${!isAuthPage ? "ml-64 pt-16" : "w-full"}`}>
          {children}
        </div>
      </div>
    </div>
  );
}