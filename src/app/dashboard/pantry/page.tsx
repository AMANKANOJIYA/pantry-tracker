"use client";

import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  ShoppingBasket,
  WandSparkles,
  Edit,
  Trash,
  ChevronLeft,
  PlusCircle,
  Upload,
  Download,
  Sparkle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  getAllData,
  deleteDataByIdProd,
  getDataByRefId,
} from "@/utils/database";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useAuth } from "@/hook/useAuth";

const sanitizePath = (path: any) => {
  const text = path.replace(/[.#$[@\]]/g, "_");
  return text;
};

export default function Pantry() {
  useAuth()
  const [data, setData] = useState<any>([]);
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      var path = `${sanitizePath(session?.user?.email)}/products`;
      const data = await getAllData(path);
      setData(data);
    };
    fetchData();
  }, [data]);

  const handleEditProduct = (id: any) => {
    router.push(`/dashboard/pantry/${id}`);
  };

  const handleDeleteProduct = (id: any) => {
    if (window.confirm("Are you sure you want to delete this Product?")) {
      deleteDataByIdProd(sanitizePath(session?.user?.email), id);
    }
  };

  const handleDownload = async (id: any) => {
    const doc = new jsPDF();
    var path = `${sanitizePath(session?.user?.email)}/items`;
    const dataItemsForProd = await getDataByRefId(path, id);
    const tableColumn = ["name", "quantity", "unit", "created_at"];
    const tableRows: Array<Array<string | number>> = [];

    dataItemsForProd.forEach((key: any) => {
      const item = key[1];
      const row = [
        item.name,
        item.quantity,
        item.unit,
        new Date(item.created_at).toLocaleString(),
      ];
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`Items_${id}.pdf`);
  };

  return (
    <main className="flex flex-1 flex-col gap-2 p-4 lg:gap-4 lg:p-6 max-h-[95vh] overflow-y-scroll ">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 ">
        {data &&
          Object.entries(data).map((value: any) => {
            return (
              <Card
                className="sm:col-span-1 "
                x-chunk="dashboard-05-chunk-0"
                key={value[0]}
              >
                <Link href={`/dashboard/pantry/${value[0]}`}>
                  <CardHeader className="pb-3">
                    <Avatar>
                      <AvatarImage src={`${value[1].images}`} />
                      <AvatarFallback>PROD</AvatarFallback>
                    </Avatar>
                    <CardTitle className="pb-2">{value[1].name}</CardTitle>
                    <CardDescription className=" text-balance leading-relaxed flex flex-row flex-wrap">
                      {value[1].description}
                    </CardDescription>
                  </CardHeader>
                </Link>
                <CardFooter className="flex item-center justify-between">
                  <Badge className="bg-blue-700 rounded-xl">
                    {value[1].type === "generated" ? (
                      <Sparkle className="h-4 w-4" />
                    ) : (
                      <Edit className="h-4 w-4" />
                    )}
                  </Badge>
                  <div>
                    <Button
                      className="mr-2"
                      onClick={() => handleEditProduct(value[0])}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => handleDeleteProduct(value[0])}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(value[0])}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </main>
  );
}
