"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin-login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md border border-ink-700 px-3 py-1.5 text-xs font-medium text-ink-200 hover:border-ink-500 hover:text-white"
    >
      Déconnexion
    </button>
  );
}
