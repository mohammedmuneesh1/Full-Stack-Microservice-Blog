"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import BlogCard from "@/components/custom/BlogCard";

const categories = [
  "Technology",
  "Programming",
  "Travel",
  "Business",
  "Education",
  "Lifestyle",
  "Health",
  "Sports",
];

interface Blog {
  id: number;
  title: string;
  description: string;
  blogcontent: string;
  image: { url: string; publicId: string };
  category: string;
  author: string;
  createdat: string;
  updatedat: string;
}

interface Props {
  data: Blog[];
}

export default function BlogAllClientPage({ data }: Props) {

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("searchQuery") || "";

  const [searchInput, setSearchInput] = useState(currentSearch);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("searchQuery", searchInput.trim());
    if (currentCategory) params.set("category", currentCategory);
    router.push(`?${params.toString()}`);
  };

  const handleCategoryClick = (cat: string) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set("searchQuery", currentSearch);
    if (currentCategory === cat) {
      // deselect
    } else {
      params.set("category", cat);
    }
    router.push(`?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f7f6f2] font-serif">
        {/* Sidebar */}
        <Sidebar className="border-r border-stone-200 bg-white w-64 shrink-0">
          <SidebarContent className="px-4 py-6">
            {/* Search */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs uppercase tracking-widest text-stone-400 mb-3 font-sans">
                Search
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search blogs..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-stone-50 border-stone-200 text-sm rounded-lg focus:ring-stone-400"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleSearch}
                    className="shrink-0 border-stone-200 hover:bg-stone-100"
                    aria-label="Search"
                  >
                    <Search size={15} />
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Categories */}
            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs uppercase tracking-widest text-stone-400 mb-3 font-sans">
                Categories
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => {
                    const active = currentCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 font-sans ${
                          active
                            ? "bg-stone-800 text-white font-medium"
                            : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {currentCategory && (
                  <button
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (currentSearch) params.set("searchQuery", currentSearch);
                      router.push(`?${params.toString()}`);
                    }}
                    className="mt-3 text-xs text-stone-400 hover:text-stone-600 font-sans underline underline-offset-2"
                  >
                    Clear filter
                  </button>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 px-8 py-10">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-2">
            <SidebarTrigger className="text-stone-500 hover:text-stone-800" />
            <h1 className="text-3xl font-bold text-stone-800 tracking-tight">
              {currentCategory ? currentCategory : "All Stories"}
            </h1>
            {currentSearch && (
              <Badge variant="secondary" className="font-sans text-xs">
                "{currentSearch}"
              </Badge>
            )}
          </div>
          <p className="text-stone-400 text-sm font-sans mb-8">
            {data?.length ?? 0} articles found
          </p>

          {/* Blog Grid */}
          {data && data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-stone-400 font-sans">
              <p className="text-lg">No stories found.</p>
              <p className="text-sm mt-1">Try a different search or category.</p>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}