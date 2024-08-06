// hooks/useAuth.ts
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession } from "next-auth/react";

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session && pathname !== "/login") {
        router.push("/login");
      }
    };
    checkSession();
  }, [router]);
};
