"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Sparkle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { createData } from "@/utils/database";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hook/useAuth";

const sanitizePath = (path: any) => {
  const text = path.replace(/[.#$[@\]]/g, "_");
  return text;
};

export default function Generated() {
  useAuth();
  const searchParams = useSearchParams();
  const search = searchParams?.get("search");
  const [data, setData] = useState<any>();
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [
                {
                  role: "user",
                  content: `Provide a JSON object with the list of items required to make ${search} . Each item should be an object with the following format: {
      name:"product to make",
      description:"about the food want to make",
      items:[
        {
          name:"name of the item",
          quantity:{
            value: number,
            unit: "kg" | "g" | "ml" | "l" | "count"
          }
        }
      ]
    }where the unit is one of "kg", "g", "ml", "l", or "count".strictly follow : No other units are accepted. eleminate small things which dont have measurments like salt, sugar, etc. } and also convert spoon size to units and add with strict units constraints. dont write a single test just want a json out put. Convert all Units like cm meter large small to restricted units i definde {kg, g, l, ml, count}, DOnt add any comment in json object make it clean and simple i am uing JOSN.parse() to parse the json object. Dont split the items just make a single array of items and add all required thorughout the recipe. Restrict using other units other then provided <Strict >`,
                },
              ],
              model: "llama3-8b-8192",
            }),
          }
        );

        const data = await response.json();
        const dataString = data.choices[0]?.message?.content;
        const jsonString = dataString.split("```")[1]?.trim();
        const cleanedJsonString = jsonString.replace(/^json/, "").trim();
        if (cleanedJsonString) {
          try {
            const jsonData = JSON.parse(cleanedJsonString);
            if (Array.isArray(jsonData)) {
              setData(jsonData[0]);
            } else if (typeof jsonData === "object" && jsonData !== null) {
              setData(jsonData);
            }
          } catch (error) {
            console.error("Failed to parse JSON:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddItemToPantry = async () => {
    try {
      const timestamp = new Date().getTime();
      var path = sanitizePath(session?.user?.email) + "/products";
      const prodData = await createData(path, {
        name: data.name,
        description: data.description,
        images: "",
        type: "generated",
        created_at: timestamp,
      });
      path = sanitizePath(session?.user?.email) + "/items";
      await Promise.all(
        data.items.map(async (product: any) => {
          const itemData = await createData(path, {
            name: product.name,
            quantity: product.quantity.value,
            unit: product.quantity.unit,
            created_at: timestamp,
            type: "generated",
            productRef: prodData.key,
            productName: data.name,
          });
        })
      );
      toast({
        title: "All items added successfully",
        description: data.name,
      });
    } catch (error) {
      console.error("Error adding documents: ", error);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6  max-h-[90vh] overflow-y-scroll">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader className="flex flex-row item-center justify-between">
          <div className="flex">
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="h-7 w-7 mr-4">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <CardTitle>{data?.name}</CardTitle>
          </div>
          <Button size="sm" className="ml-8" onClick={handleAddItemToPantry}>
            Add to Pantry
            <Sparkle className="h-4 w-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="mb-8 ml-3">{data?.description}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data?.items.map((item: any, index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">generated</Badge>
                      </TableCell>
                      <TableCell>{item.quantity.value}</TableCell>
                      <TableCell>{item.quantity.unit}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground"></div>
        </CardFooter>
      </Card>
    </main>
  );
}
