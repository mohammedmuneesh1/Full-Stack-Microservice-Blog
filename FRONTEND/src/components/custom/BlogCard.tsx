import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
 
export interface Blog {
  id: number;
  title: string;
  description: string;
  blogcontent: string;
  image: { url: string; publicId: string };
  category: string;
  author: string;
  createdat: string;
  updatedat?: string;
}
 
export default function BlogCard({ blog }: { blog: Blog }) {
  const formattedDate = new Date(blog.createdat).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
 
  return (
    <Link href={`/blogs/${blog.id}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-stone-300 hover:shadow-md transition-all duration-200 h-full flex flex-col">
        {/* Image */}
        <div className="relative w-full h-48 bg-stone-100 overflow-hidden">
          {blog.image?.url ? (
            <Image
              src={blog.image.url}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
              <span className="text-stone-300 text-4xl font-serif">✦</span>
            </div>
          )}
 
          {/* Category badge over image */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 text-stone-700 text-xs font-sans font-medium border-0 shadow-sm backdrop-blur-sm">
              {blog.category}
            </Badge>
          </div>
        </div>
 
        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h2 className="text-base font-bold text-stone-800 leading-snug mb-2 line-clamp-2 group-hover:text-stone-600 transition-colors font-serif">
            {blog.title}
          </h2>
          <p className="text-sm text-stone-500 line-clamp-2 font-sans leading-relaxed flex-1">
            {blog.description}
          </p>
 
          {/* Footer */}
          <div className="flex items-center gap-1.5 mt-4 text-xs text-stone-400 font-sans">
            <CalendarDays size={12} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
 