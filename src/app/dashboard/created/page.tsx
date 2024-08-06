"use client";

import { ChevronLeft, PlusCircle, Trash } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import storage from "@/utils/storegabucket";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useSession } from "next-auth/react";
import { createData } from "@/utils/database";
import { useAuth } from "@/hook/useAuth";

interface product {
  name: string;
  quantity: number;
  unit: "g" | "kg" | "ml" | "l" | "u";
}

const sanitizePath = (path: any) => {
  return path.replace(/[.#$[\@]]/g, "_");
};

export default function Generated() {
  useAuth();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState();
  const { data: session } = useSession();
  const [products, setProducts] = useState<product[]>([]);
  const type = "created";

  const handleAddItem = (event: any) => {
    setProducts((prev) => [
      ...prev,
      {
        name: "",
        quantity: 0,
        unit: "kg",
      },
    ]);
  };

  const handleDeleteItem = (index: any) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async () => {
    try {
      const timestamp = new Date().getTime();
      var path = sanitizePath(session?.user?.email) + "/products";
      const prodData = await createData(path, {
        name: productName,
        description: productDescription,
        images: productImage,
        type: type,
        created_at: timestamp,
      });
      path = sanitizePath(session?.user?.email) + "/items";
      await Promise.all(
        products.map(async (product) => {
          const itemData = await createData(path, {
            name: product.name,
            quantity: product.quantity,
            unit: product.unit,
            created_at: timestamp,
            type: type,
            productRef: prodData.key,
            productName: productName,
          });
        })
      );
    } catch (error) {
      console.error("Error adding documents: ", error);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6  max-h-[95vh] overflow-y-scroll">
      <div className="mx-auto grid flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            New Product
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            {type}
          </Badge>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button size="sm" onClick={handleSaveProduct}>
              Save Product
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8 ">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 min-w-[50vw]">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      className="min-h-32"
                      onChange={(e) => setProductDescription(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle>Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="w-[100px]">Unit</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Label
                              htmlFor={`name-${index}`}
                              className="sr-only"
                            >
                              Name
                            </Label>
                            <Input
                              id={`name-${index}`}
                              type="text"
                              defaultValue={product.name}
                              onChange={(e) => {
                                setProducts((prev) =>
                                  prev.map((item, i) => {
                                    if (i === index) {
                                      return {
                                        ...item,
                                        name: e?.target.value,
                                      };
                                    }
                                    return item;
                                  })
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Label
                              htmlFor={`quantity-${index}`}
                              className="sr-only"
                            >
                              Quantity
                            </Label>
                            <Input
                              id={`quantity-${index}`}
                              type="number"
                              defaultValue={product.quantity}
                              onChange={(e) => {
                                setProducts((prev) =>
                                  prev.map((item, i) => {
                                    if (i === index) {
                                      return {
                                        ...item,
                                        quantity: parseInt(e?.target.value),
                                      };
                                    }
                                    return item;
                                  })
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <ToggleGroup
                              type="single"
                              defaultValue={product.unit}
                              variant="outline"
                              onValueChange={(value: any) => {
                                setProducts((prev: any) =>
                                  prev.map((item: any, i: any) => {
                                    if (i === index) {
                                      return {
                                        ...item,
                                        unit: value,
                                      };
                                    }
                                    return item;
                                  })
                                );
                              }}
                            >
                              <ToggleGroupItem value="g">g</ToggleGroupItem>
                              <ToggleGroupItem value="kg">kg</ToggleGroupItem>
                              <ToggleGroupItem value="ml">ml</ToggleGroupItem>
                              <ToggleGroupItem value="l">l</ToggleGroupItem>
                              <ToggleGroupItem value="u">COUNT</ToggleGroupItem>
                            </ToggleGroup>
                          </TableCell>
                          <TableCell>
                            <Button onClick={() => handleDeleteItem(index)}>
                              <Trash className="h-4 w-4"></Trash>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                  onClick={handleAddItem}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Item
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="file"
                      onChange={(e: any) => {
                        const file = e.target.files[0];
                        const storageRef = ref(storage, `images/${file.name}`);
                        const uploadTask = uploadBytesResumable(
                          storageRef,
                          file
                        );
                        uploadTask.on(
                          "state_changed",
                          (snapshot) => {
                            const progress =
                              (snapshot.bytesTransferred /
                                snapshot.totalBytes) *
                              100;
                            switch (snapshot.state) {
                              case "paused":
                                break;
                              case "running":
                                break;
                            }
                          },
                          (error) => {
                            console.log(error);
                          },
                          () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(
                              (downloadURL: any) => {
                                setProductImage(downloadURL);
                              }
                            );
                          }
                        );
                      }}
                    />
                    <span className="sr-only">Upload</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle>Archive Product</CardTitle>
                <CardDescription>
                  Available Soon in the next update
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button size="sm" variant="secondary">
                  Archive Product
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm">Save Product</Button>
        </div>
      </div>
    </main>
  );
}
