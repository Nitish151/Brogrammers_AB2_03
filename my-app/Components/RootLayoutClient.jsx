"use client"; // This file can use hooks like usePathname

import { usePathname } from "next/navigation";
import Navbar from "@/Components/Navbar/Navbar";
import Sidebar from "@/Components/Sidebar/Sidebar";

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/signin" || pathname === "/signup"; // Hide Navbar & Sidebar on auth pages

  return (
    <div className="flex">
      {/* Show Navbar only on non-auth pages */}
      {!isAuthPage && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
      )}

      {/* Sidebar Wrapper */}
      {!isAuthPage && (
        <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gray-100 shadow-md">
          <Sidebar />
        </div>
      )}

      {/* Main Content - Adjust margin for sidebar and navbar */}
      <div className={`flex-1 ${!isAuthPage ? "ml-64 mt-16" : "w-full"}`}>
        {children}
      </div>
    </div>
  );
}