"use client";

import { LongArrowRightIcon } from "@/components/SVG";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import API_URL from "@/lib/api-url";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface IExchangeRates {
  rate: number;
  currency: string;
  base: string;
}

interface ICurrencyExchanges {
  key: string;
  rates: IExchangeRates[];
  date?: string;
}

export const getExchangeRates = async (currency: string) => {
  const res = await fetch(`${API_URL}/currencies/${currency}.json`);
  const data = await res.json();

  const exchangeData: ICurrencyExchanges = {
    key: currency,
    date: data.date,
    rates: Object.keys(data[currency] ?? {}).map((key) => {
      return {
        rate: data[currency][key],
        currency: key,
        base: currency,
      };
    }),
  };

  return exchangeData;
};

const columns: ColumnDef<IExchangeRates>[] = [
  {
    id: "#",
    header: "#",
    cell: ({ row }) => <span className="font-medium uppercase">{row.index + 1}</span>,
  },
  {
    id: "base",
    header: "Base Currency",
    cell: ({ row }) => <span className="font-medium uppercase">{row.original.base}</span>,
  },
  {
    id: "currency",
    header: "Currency",
    cell: ({ row }) => <span className="font-medium uppercase">{row.original.currency}</span>,
  },
  {
    id: "rate",
    header: "Rate",
    accessorKey: "rate",
    cell: ({ row }) => (
      <div className="flex items-center justify-end">
        <span className=" uppercase">{row.original.base} 1</span> <LongArrowRightIcon className="mx-4 fill-sx-primary" />{" "}
        <span className=" uppercase">
          {row.original.currency} {row.original.rate}
        </span>
      </div>
    ),
  },
];

export default function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [data, setData] = useState<ICurrencyExchanges | null>(null);
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const table = useReactTable({
    data: data?.rates ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  useEffect(() => {
    setLoading(true);
    getExchangeRates((params?.currency as string) ?? "")
      .then((data) => setData(data))
      .finally(() =>
        setTimeout(() => {
          setLoading(false);
        }, 800)
      );
  }, [params?.currency]);

  return (
    <main className="flex min-h-[calc(100vh-100px)] flex-col items-center p-24 bg-[url(/images/bg_cover.png)] bg-no-repeat bg-center">
      <Table>
        <TableCaption>
          Exchange rates for base currency: <b className="uppercase">{params.currency}</b>.
        </TableCaption>
        <TableHeader>
          <TableRow>
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => (
                  <TableHead
                    className={cn({
                      "w-8": i === 0,
                      "text-right": header.id === "rate",
                    })}
                    key={header.id}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={`${i}`}>
                  <TableCell className="font-medium uppercase">
                    <Skeleton className="w-full h-6" />
                  </TableCell>
                  <TableCell className="font-medium uppercase">
                    <Skeleton className="w-full h-6" />
                  </TableCell>
                  <TableCell className="font-medium uppercase">
                    <Skeleton className="w-full h-6" />
                  </TableCell>
                  <TableCell className="text-righ">
                    <Skeleton className="w-full h-6" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="font-medium uppercase" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className=" w-full flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">{table.getPageCount()}</div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
