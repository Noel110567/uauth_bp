"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NewsCarouselWrapper from "./NewsCarouselWrapper";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role;

  useEffect(() => {
    if (status === "loading") return;
    if (role !== "admin" && role !== "editor") {
      router.replace("/");
    }
  }, [role, status, router]);

  if (status === "loading" || (role !== "admin" && role !== "editor")) {
    return null;
  }

  return (
    <div className="dashboard-main-bg p-6 relative overflow-hidden" style={{minHeight:'100vh'}}>
      <h1 className="text-2xl font-bold mb-2 text-blue-100 drop-shadow-lg">Dashboard</h1>
      <p className="text-blue-200 mb-4">Welcome to the dashboard sample page.</p>
      <NewsCarouselWrapper />
    </div>
  );
}
