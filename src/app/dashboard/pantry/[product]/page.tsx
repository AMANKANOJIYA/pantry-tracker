"use client";

import { ChevronLeft, PlusCircle, Trash, Edit } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  getDataByRefId,
  getAllData,
  deleteDataById,
  updateElement,
} from "@/utils/database";
import { useParams } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hook/useAuth";
const sanitizePath = (path: any) => {
  const text = path.replace(/[.#$[@\]]/g, "_");
  return text;
};
import storage from "@/utils/storegabucket";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function Product() {
  useAuth();
  const [items, setItems] = useState([]);
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<any>();
  const [unit, setUnit] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodType, setProdType] = useState("");
  const [prodImage, setProdImage] = useState("");
  const params = useParams();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const product = params?.product;
      var path = `${sanitizePath(session?.user?.email)}/products/${product}`;
      const data = await getAllData(path);
      setProdName(data?.name);
      setProdDesc(data?.description);
      setProdType(data?.type);
      setProdImage(data?.images);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const product = params?.product;
      var path = `${sanitizePath(session?.user?.email)}/items`;
      const data = await getDataByRefId(path, product);
      setItems(data);
    };
    fetchItems();
  }, []);

  const handleDeleteItem = async (index: any, id: any) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      var path = `${sanitizePath(session?.user?.email)}/items`;
      await deleteDataById(path, id);
      setItems(items.filter((_: any, i: any) => i !== index));
    }
  };

  const handleEditItem = async (id: any) => {
    var path = `${sanitizePath(session?.user?.email)}/items/${id}`;
    const item = {
      name: name,
      quantity: quantity,
      unit: unit,
    };
    const newElement = await updateElement(path, item);
    const index = items.findIndex((item: any) => item[0] === id);
    const updatedItems: any = [...items];
    updatedItems[index] = [newElement.key, item];
    setItems(updatedItems);
    toast({
      title: "Item Edited successfully",
      description: name,
    });
  };

  const handleProdDetailSave = async () => {
    var path = `${sanitizePath(session?.user?.email)}/products/${
      params?.product
    }`;
    const element = {
      name: prodName,
      description: prodDesc,
      type: prodType,
      images: prodImage,
    };
    await updateElement(path, element);
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
            {prodName}
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            {prodType}
          </Badge>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push("/dashboard/pantry");
              }}
            >
              Discard
            </Button>
            <Button size="sm" onClick={handleProdDetailSave}>
              Save Product
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
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
                      defaultValue={prodName}
                      onChange={(e: any) => {
                        setProdName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      defaultValue={prodDesc}
                      className="min-h-32"
                      onChange={(e: any) => {
                        setProdDesc(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Edit</TableHead>
                      <TableHead>Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items &&
                      items.map((item: any, index: any) => {
                        return (
                          <TableRow key={item[0]}>
                            <TableCell>
                              <Input type="text" defaultValue={item[1].name} />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                defaultValue={item[1].quantity}
                              />
                            </TableCell>
                            <TableCell>
                              <ToggleGroup
                                type="single"
                                defaultValue={item[1].unit}
                                variant="outline"
                              >
                                <ToggleGroupItem value="g">g</ToggleGroupItem>
                                <ToggleGroupItem value="kg">kg</ToggleGroupItem>
                                <ToggleGroupItem value="ml">ml</ToggleGroupItem>
                                <ToggleGroupItem value="l">l</ToggleGroupItem>
                                <ToggleGroupItem value="u">
                                  COUNT
                                </ToggleGroupItem>
                              </ToggleGroup>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger>
                                  <Button variant="outline">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Item</DialogTitle>
                                  </DialogHeader>
                                  <form
                                    onSubmit={() => handleEditItem(item[0])}
                                  >
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          htmlFor="name"
                                          className="text-right"
                                        >
                                          Name
                                        </Label>
                                        <Input
                                          id="name"
                                          defaultValue={item[1].name}
                                          className="col-span-3"
                                          onChange={(e: any) =>
                                            setName(e.target.value)
                                          }
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          htmlFor="quantity"
                                          className="text-right"
                                        >
                                          Quantity
                                        </Label>
                                        <Input
                                          id="quantity"
                                          type="number"
                                          defaultValue={item[1].quantity}
                                          className="col-span-3"
                                          onChange={(e: any) => {
                                            setQuantity(e.target.value);
                                          }}
                                        />
                                      </div>
                                      <div className=" items-center ">
                                        <ToggleGroup
                                          type="single"
                                          defaultValue={item[1].unit}
                                          variant="outline"
                                          id="unit"
                                          onValueChange={(value: any) => {
                                            setUnit(value);
                                          }}
                                        >
                                          <ToggleGroupItem value="g">
                                            g
                                          </ToggleGroupItem>
                                          <ToggleGroupItem value="kg">
                                            kg
                                          </ToggleGroupItem>
                                          <ToggleGroupItem value="ml">
                                            ml
                                          </ToggleGroupItem>
                                          <ToggleGroupItem value="l">
                                            l
                                          </ToggleGroupItem>
                                          <ToggleGroupItem value="u">
                                            COUNT
                                          </ToggleGroupItem>
                                        </ToggleGroup>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button type="submit">
                                        Save changes
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                            <TableCell>
                              <Button
                                className="bg-red-600"
                                onClick={() => handleDeleteItem(index, item[0])}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button size="sm" variant="ghost" className="gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Variant
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
                    <Drawer>
                      <DrawerTrigger>Open Image</DrawerTrigger>
                      <DrawerContent className="grid justify-center item-center">
                        <Image
                          src={prodImage}
                          alt="Dynamic Image"
                          width={500}
                          height={300}
                          className="m-8"
                        />
                        <DrawerClose>
                          <Button variant="outline" className="mb-10">
                            Cancel
                          </Button>
                        </DrawerClose>
                      </DrawerContent>
                    </Drawer>

                    <input
                      type="file"
                      defaultValue={prodImage}
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
                                setProdImage(downloadURL);
                              }
                            );
                          }
                        );
                      }}
                    />
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.push("/dashboard/pantry");
            }}
          >
            Discard
          </Button>
          <Button size="sm" onClick={handleProdDetailSave}>
            Save Product
          </Button>
        </div>
      </div>
    </main>
  );
}
