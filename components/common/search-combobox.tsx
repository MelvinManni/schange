import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { useState } from "react";

import Link from "next/link";
import { Card } from "../ui/card";
import API_URL from "@/lib/api-url";

type Props = {};

interface ICurrency {
  key: string;
  name: string;
}

const getCurrencies = async () => {
  const res = await fetch(`${API_URL}/currencies.json`);
  const data = await res.json();

  const currency: ICurrency[] = Object.keys(data).map((key) => {
    return {
      key,
      name: data[key],
    };
  });

  return currency ?? [];
};

export default async function SearchCombobox({}: Props) {
    const currencies = await getCurrencies();

  return (
    <Command className="bg-transparent w-full items-center">
      <div className="w-full max-w-[60rem]">
        <div className="flex w-full">
          <CommandInput placeholder="Search for an anime..." className="w-full h-14 rounded-r-none dark:ring-0 dark:focus:outline-none" />
          <Button className="h-14 bg-sx-primary rounded-l-none dark:hover:bg-sx-primary/95">
            <SearchIcon />
          </Button>
        </div>
        <Card className="w-full mt-2 max-h-[350px] pb-6 overflow-y-auto">
          <CommandEmpty className="text-slate-600 text-center p-4">No Anime found.</CommandEmpty>
          <CommandGroup>
            {currencies.map((currency) => (
              <CommandItem key={currency.key} className="flex items-center gap-3 p-0">
                <Link href={`/exchange/${currency.key}`} className="p-4 w-full">
                  {!!currency.name?.trim() ? currency.name : currency.key.toUpperCase()}
                  <span className="uppercase ml-1">({currency.key})</span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </Card>
      </div>
    </Command>
  );
}
