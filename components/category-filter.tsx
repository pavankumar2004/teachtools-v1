"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useTransition } from "react";

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

interface CategoryFilterProps {
  categories: Category[];
}

const SEARCH_DEBOUNCE_MS = 300;

const SearchInput = ({
  defaultValue,
  onChange,
  isPending,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
  isPending: boolean;
}) => (
  <div className="relative w-full max-w-lg mx-auto">
    <Search
      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden="true"
    />
    <Input
      type="text"
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
      className="h-10 w-full rounded-md border border-input pl-9 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Search items"
    />
    {isPending && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <div
          className="h-3 w-3 animate-spin rounded-full border-b-2 border-foreground"
          aria-hidden="true"
        />
      </div>
    )}
  </div>
);

export const CategoryFilter = ({ categories }: CategoryFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const [isPending, startTransition] = useTransition();

  const handleCategoryClick = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === null || categoryId === currentCategory) {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }, SEARCH_DEBOUNCE_MS);

  return (
    <div className="my-12 flex flex-col items-center justify-center space-y-6">
      {/* Search Input - Centered */}
      <div className="w-full max-w-md">
        <SearchInput
          defaultValue={searchParams.get("search") ?? ""}
          onChange={handleSearch}
          isPending={isPending}
        />
      </div>
      
      {/* All Button - Centered */}
      <div className="flex justify-center">
        <Button
          variant={currentCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(null)}
          className="min-w-[60px]"
          aria-pressed={currentCategory === null}
        >
          All
        </Button>
      </div>

      {/* Category Buttons - Centered */}
      <div
        className="flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="Category filters"
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={currentCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(category.id)}
            aria-pressed={currentCategory === category.id}
          >
            {category.icon && (
              <span className="mr-1" role="img" aria-label={category.name}>
                {category.icon}
              </span>
            )}
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
