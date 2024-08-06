"use client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/useAuth";

export default function Dashboard() {
  useAuth();
  const [name, setName] = useState("");
  const { data: session, status }: any = useSession();
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && inputValue) {
      handleGenerateSubmit();
    }
  };

  const handleGenerateSubmit = () => {
    if (!inputValue) return;
    router.push(`/dashboard/generated?search=${inputValue}`);
  };

  const handleCreateSubmit = () => {
    router.push("/dashboard/created");
  };

  useEffect(() => {
    if (status === "loading") return;
    if (session) setName(session?.user?.name);
  }, [status, session]);

  return (
    <main className="flex  flex-col items-center justify-between p-8 ">
      <Card className="w-full h-full">
        <CardHeader>
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Hello {name ? name : ""}, Welcome to Pantry!
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-1 text-center mb-[4rem]">
            <h4 className="text-sm text-muted-foreground mt-8 ">
              What deleicious meal are you craving for?
            </h4>
            <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
              <Input
                type="email"
                placeholder="Search for a meal"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <Button type="submit" onClick={handleGenerateSubmit}>
                Generate
              </Button>
            </div>
          </div>
          <p className="text-sm text-center">
            -------------- Or --------------
          </p>
          <div className="flex flex-col items-center gap-1 text-center mb-[4rem]">
            <h4 className="text-sm text-muted-foreground mt-8 ">
              What deleicious meal are you craving for?
            </h4>
            <div className="flex w-full max-w-sm items-center justify-center space-x-2 mt-2">
              <Button type="submit" onClick={handleCreateSubmit}>
                Create Your Own Product
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
