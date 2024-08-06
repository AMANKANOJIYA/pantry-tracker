// src/app/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) router.push("/login"); // If no session, redirect to login
    if (session) router.push("/dashboard"); // If session exists, redirect to dashboard
  }, [session, status, router]);

  return null; // This component doesn't render anything
}
