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
import { Input } from "@/components/ui/input";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

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

const getExchangeRates = async (currency: string) => {
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
    enableSorting: false,
  },
  {
    id: "base",
    header: "Base Currency",
    cell: ({ row }) => <span className="font-medium uppercase">{row.original.base}</span>,
    enableSorting: false,
  },
  {
    id: "currency",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Currency
        {column.getIsSorted() !== "asc" ? <ArrowDownIcon className="ml-2 h-4 w-4" /> : <ArrowUpIcon className="ml-2 h-4 w-4" />}
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium uppercase px-4 py-2">{row.original.currency}</span>,
    accessorKey: "currency",
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
    enableSorting: true,
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

  const fetchData = () => {
    setLoading(true);
    getExchangeRates((params?.currency as string) ?? "")
      .then((data) => setData(data))
      .finally(() =>
        setTimeout(() => {
          setLoading(false);
        }, 800)
      );
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-[calc(100vh-100px)] flex-col items-center p-12 sm:p-24 bg-[url(/images/bg_cover.png)] bg-no-repeat bg-center">
      <div className="flex items-center justify-between py-4 w-full sm:flex-row flex-col gap-2">
        <Input
          placeholder="Filter currency..."
          value={(table.getColumn("currency")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("currency")?.setFilterValue(event.target.value)}
          className=" sm:max-w-sm"
        />
        <Button
          size="sm"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => {
            table.resetColumnFilters();
            table.resetSorting();
            fetchData();
          }}
        >
          Refresh
        </Button>
      </div>
      <div className="rounded-md border w-full pb-2">
        <Table>
          <TableCaption>
            Exchange rates for base currency: <b className="uppercase">{params.currency}</b>.
          </TableCaption>
          <TableHeader>
            <TableRow>
              {table.getHeaderGroups().map((headerGroup) => (
                <React.Fragment key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className={cn({
                        "w-12": header.id === "#",
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
                      <Skeleton className="w-12 h-6" />
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
                    <TableCell
                      className={cn("font-medium uppercase min-w-min", {
                        "w-12": cell.id === "#",
                        "text-right": cell.id === "rate",
                      })}
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className=" w-full flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
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
