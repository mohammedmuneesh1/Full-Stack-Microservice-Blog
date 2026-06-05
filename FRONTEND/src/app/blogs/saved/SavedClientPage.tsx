"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BlogCard, { Blog } from "@/components/custom/BlogCard";
import { Bookmark } from "lucide-react";

interface SavedClientPageProps {
  blogData: {
    success: boolean;
    response: string;
    data?: Blog[];
  };
}

const CATEGORIES = ["All", "Technology", "Programming", "Travel", "Business", "Education", "Lifestyle", "Health", "Sports"];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Technology:  { bg: "bg-teal-50",   text: "text-teal-800"   },
  Programming: { bg: "bg-purple-50", text: "text-purple-800" },
  Travel:      { bg: "bg-amber-50",  text: "text-amber-800"  },
  Business:    { bg: "bg-blue-50",   text: "text-blue-800"   },
  Education:   { bg: "bg-green-50",  text: "text-green-800"  },
  Lifestyle:   { bg: "bg-pink-50",   text: "text-pink-800"   },
  Health:      { bg: "bg-red-50",    text: "text-red-800"    },
  Sports:      { bg: "bg-orange-50", text: "text-orange-800" },
};

const SavedClientPage: React.FC<SavedClientPageProps> = ({ blogData }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!blogData) return;
    if (!blogData.success) toast.error(blogData.response);
  }, [blogData]);

  const blogs = blogData?.data ?? [];

  // Only show categories that exist in saved blogs
  const availableCategories = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];

  const filtered =
    activeCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === activeCategory);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <div className=" mx-auto px-6 pt-10 pb-16">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
            <Bookmark size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-stone-800">Saved blogs</h1>
            <p className="text-sm text-stone-400 mt-0.5">
              {blogs.length} {blogs.length === 1 ? "article" : "articles"} bookmarked
            </p>
          </div>
        </div>

        {/* Category filter chips */}
        {blogs.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-8">
            {availableCategories.map((cat) => {
              const active = activeCategory === cat;
              const color = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-4 py-1.5 rounded-full border transition-all duration-150 font-medium ${
                    active
                      ? "bg-stone-800 text-white border-stone-800"
                      : color
                      ? `${color.bg} ${color.text} border-transparent`
                      : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Grid or empty state */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-300">
              <Bookmark size={26} />
            </div>
            <div>
              <p className="text-stone-500 font-medium">
                {activeCategory === "All"
                  ? "No saved blogs yet"
                  : `No saved blogs in ${activeCategory}`}
              </p>
              <p className="text-stone-400 text-sm mt-1">
                {activeCategory === "All"
                  ? "Blogs you save will appear here."
                  : "Try a different category filter."}
              </p>
            </div>
            {activeCategory !== "All" && (
              <button
                onClick={() => setActiveCategory("All")}
                className="text-sm text-stone-500 underline underline-offset-2 hover:text-stone-700"
              >
                Show all saved blogs
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedClientPage;