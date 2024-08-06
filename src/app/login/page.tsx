"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github, Chrome } from "lucide-react";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session) router.push("/Login");
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full lg:grid h-[100vh] lg:grid-cols-2 ">
      <div className="hidden bg-muted lg:block">
        <Image
          src="/authimg.jpg"
          alt="Image"
          width="500"
          height="500"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Welcome to the Pantry Tracker
            </p>
          </div>
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="w-full bg-[#4285F4] text-white"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
            <Button
              variant="outline"
              className="w-full bg-[#2b3137] text-white"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <Github className="mr-2 h-4 w-4" />
              Login with Github
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            It will be really an amazing journey with us
          </div>
        </div>
      </div>
    </div>
  );
}
