"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./Button";

export default function DashboardHeader() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
      <span className="text-sm font-medium text-muted">Aramway Admin Dashboard</span>
      <Button
        type="button"
        variant="outline"
        onClick={handleLogout}
        disabled={loggingOut}
        data-testid="logout-btn"
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </Button>
    </header>
  );
}
