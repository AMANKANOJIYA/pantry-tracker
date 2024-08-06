"use client";

import Link from "next/link";
import { ChevronLeft, Download } from "lucide-react";

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
import { getAllData } from "@/utils/database";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useAuth } from "@/hook/useAuth";

const sanitizePath = (path: any) => {
  const text = path.replace(/[.#$[@\]]/g, "_");
  return text;
};

export default function Item() {
  useAuth();
  const [data, setData] = useState<any>([]);
  const { data: session } = useSession();

  function formatDateTime(utcDateTimeString: string) {
    const date = new Date(utcDateTimeString);
    const localDate = date.toLocaleDateString();
    const localTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${localDate} ${localTime}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      var path = `${sanitizePath(session?.user?.email)}/items`;
      const data = await getAllData(path);
      setData(data);
    };
    fetchData();
  }, []);

  const handleDownload = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "name",
      "quantity",
      "unit",
      "productName",
      "created_at",
    ];
    const tableRows: Array<Array<string | number>> = [];

    Object.keys(data).forEach((key) => {
      const item = data[key];
      const row = [
        item.name,
        item.quantity,
        item.unit,
        item.productName,
        new Date(item.created_at).toLocaleString(),
      ];
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("AllItems.pdf");
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-scroll ">
      <Card>
        <CardHeader className="flex flex-row item-center justify-between">
          <div className="flex">
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="h-7 w-7 mr-4">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <CardTitle>Items</CardTitle>
          </div>
          <Button size="sm" className="ml-8" onClick={handleDownload}>
            Download
            <Download className="h-4 w-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>Product</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                Object.entries(data).map((value: any) => {
                  return (
                    <TableRow key={value[0]}>
                      <TableCell className="font-medium">
                        {value[1].name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{value[1].type}</Badge>
                      </TableCell>
                      <TableCell>{value[1].quantity}</TableCell>
                      <TableCell>{value[1].unit}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDateTime(value[1].created_at)}
                      </TableCell>
                      <TableCell>{value[1].productName}</TableCell>
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
