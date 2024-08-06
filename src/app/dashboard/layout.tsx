"use client";

import Link from "next/link";
import {
  Bell,
  CircleUser,
  Menu,
  Package,
  Package2,
  ShoppingBasket,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hook/useAuth";

export default function Dashboard({ children }: any) {
  useAuth();
  const pathName = usePathname();
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] max-h-screen overflow-hidden">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/dashboard/pantry"
              className="flex items-center gap-2 font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="">Pantry</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  pathName === "/dashboard" ? "" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <WandSparkles className="h-4 w-4" />
                Generate
              </Link>
              <Link
                href="/dashboard/pantry"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  pathName === "/dashboard/pantry"
                    ? "hover:text-primary"
                    : "text-muted-foreground"
                } transition-all `}
              >
                <ShoppingBasket className="h-4 w-4" />
                Pantry
              </Link>
              <Link
                href="/dashboard/item"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  pathName === "/dashboard/item"
                    ? "text-foreground"
                    : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <Package className="h-4 w-4" />
                Items
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Pantry</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                    pathName === "/dashboard"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  } hover:text-foreground`}
                >
                  <WandSparkles className="h-5 w-5" />
                  Generate
                </Link>
                <Link
                  href="/dashboard/pantry"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 ${
                    pathName === "/dashboard/pantry"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  } hover:text-foreground`}
                >
                  <ShoppingBasket className="h-5 w-5" />
                  Pantry
                </Link>
                <Link
                  href="/dashboard/item"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                    pathName === "/dashboard/item"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  } hover:text-foreground`}
                >
                  <Package className="h-5 w-5" />
                  Items
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  signOut({ callbackUrl: "/login", redirect: true });
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {children}
      </div>
    </div>
  );
}
