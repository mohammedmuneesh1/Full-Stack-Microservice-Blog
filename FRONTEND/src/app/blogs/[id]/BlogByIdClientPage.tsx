"use client";

import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, User, MessageSquare, Send, Trash, BookmarkCheck, Bookmark } from "lucide-react";
import { DELETE_BLOG_COMMENT, POST_BLOG_COMMENT, SAVE_OR_REMOVE_BLOG } from "@/api/blogApi"; // you'll implement this
import { useAppcontext } from "@/context/AppContext";
import toast from "react-hot-toast";

interface Comment {
  id: number;
  comment: string;
  userid:string;
  username: string;
  createdat: string;
}

export interface Blog {
  id: number;
  title: string;
  description: string;
  blogcontent: string;
  image: { url: string; publicId: string };
  category: string;
  author: {
    _id?:string;
    cloudinaryImage: {
      url: string,
      publicId: string
  };
    name:string,
};
isBlogSaved:boolean;
createdat: string;
updatedat?:string;
}

interface Props {
  blogData: {
    success:false,
    data?:Blog,
    response:string;
  };
  commentsData: {
    success:false,
    data?:Comment[],
    response:string;
  };
  blogId: string;
}

export default function BlogDetailClientPage({ blogData, commentsData: initialComments, blogId }: Props) {
  const { isAuth,user} = useAppcontext();
  const [comments, setComments] = useState<Comment[]>(initialComments?.data ?? []);
  const [commentText, setCommentText] = useState("");
  const [blog, setBlog] = useState(blogData?.data ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");



  const formattedDate = new Date(blog?.createdat ?? "").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await POST_BLOG_COMMENT(blogId, commentText.trim());
      if(!res?.success){
        return toast.error(res?.response);
      }
      setComments((prev) => [res?.data, ...prev]);
      setCommentText("");
    } catch (err) {
      setError("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };



const deleteComment = async (commentId:number) => {
  const isConfirmed = window.confirm(
    "Are you sure you want to delete this comment?"
  );

  if (!isConfirmed) return;

  // Delete comment API call here

  const res = await DELETE_BLOG_COMMENT(blogId,commentId);
  if(!res?.success){
    return toast.error(res?.response)
  }
  else{
    setComments((prev)=>
        
        {
          return prev.filter((val) => val.id !== Number(commentId));
    })
  }
};


const SAVE_OR_REMOVE_FN =async ()=>{
    toast.loading(blog?.isBlogSaved ? "Removing from saved blog..." : "Saving blog...");
    const res = await SAVE_OR_REMOVE_BLOG(blogId);
    toast.dismiss();
    if(res?.success){
        if (blog) {
          
           setBlog((prev) => {
               if (!prev) return prev;
                return {
                ...prev,
                  isBlogSaved: !prev.isBlogSaved,
                 };
               });
        }
       toast.success(res?.response); 
    }
    else{
        toast.error(res?.response)
    }
}



  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen text-stone-400 font-sans">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      {/* Hero Image */}
      {blog?.image?.url && (
        <div className="relative w-full h-72 md:h-96 bg-stone-200">
          <Image
            src={blog?.image?.url}
            alt={blog?.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <Badge className="bg-stone-800 text-white font-sans text-xs border-0">
            {blog?.category ?? "N/A" }
          </Badge>
          <span className="flex items-center gap-1 text-xs text-stone-400 font-sans">
            <CalendarDays size={12} />
            {formattedDate}
          </span>

        <span className="flex items-center gap-2 text-xs text-stone-400 font-sans">
    <img
      src={blog?.author?.cloudinaryImage?.url || "/default-avatar.png"}
      alt={blog?.author?.name || "Author"}
      className="w-6 h-6 rounded-full object-cover"
    />
    <span>{blog?.author?.name || "Unknown Author"}</span>
  </span>

<span
onClick={()=>SAVE_OR_REMOVE_FN()}
className="flex items-center gap-1 text-xs text-stone-400 font-sans">
  {blog?.isBlogSaved ? (
    <>
      <BookmarkCheck
      
       size={14} />
      Saved
    </>
  ) : (
    <>
      <Bookmark size={14} />
      Save
    </>
  )}
</span>


        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 leading-tight mb-4 font-serif">
          {blog?.title ?? "N/A"}
        </h1>

        {/* Description */}
        <p className="text-lg text-stone-500 leading-relaxed mb-8 font-sans border-l-4 border-stone-300 pl-4 italic">
          {blog.description ?? "N/A"}
        </p>

        {/* Blog HTML Content */}
        <div
          className="prose prose-stone max-w-none prose-headings:font-serif prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: blog?.blogcontent ?? "N/A" }}
        />

        {/* Divider */}
        <div className="my-12 border-t border-stone-200" />

        {/* Comments Section */}
        <section>
          <h2 className="text-xl font-bold text-stone-800 font-serif mb-6 flex items-center gap-2">
            <MessageSquare size={20} />
            Comments
            <span className="text-sm font-sans font-normal text-stone-400 ml-1">
              ({comments.length})
            </span>
          </h2>

          {/* Comment input — only if authenticated */}
          {isAuth ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-8">
              <Textarea
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="resize-none border-stone-200 bg-stone-50 text-sm font-sans min-h-[100px] rounded-xl focus:ring-stone-400"
              />
              {error && (
                <p className="text-red-500 text-xs font-sans mt-2">{error}</p>
              )}
              <div className="flex justify-end mt-3">
                <Button
                  onClick={handleSubmitComment}
                  disabled={submitting || !commentText.trim()}
                  className="bg-stone-800 hover:bg-stone-700 text-white font-sans text-sm rounded-xl flex items-center gap-2"
                >
                  <Send size={14} />
                  {submitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-8 text-center font-sans">
              <p className="text-stone-500 text-sm">
                Please{" "}
                <a href="/login" className="text-stone-800 underline underline-offset-2 font-medium">
                  log in
                </a>{" "}
                to leave a comment.
              </p>
            </div>
          )}

          {/* Comments List */}
          {comments?.length > 0 ? (
            <div className="flex flex-col gap-4">
              {comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-2xl border border-stone-100 p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center">
                      <User size={14} className="text-stone-500" />
                    </div>
                    <span className="text-sm font-medium text-stone-700 font-sans">
                      {comment?.username ?? "Anonymous"}
                    </span>
                    <span className="text-xs text-stone-400 font-sans ml-auto">
                      {new Date(comment.createdat).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>

                    <span>
                        {
                            user?._id === comment?.userid && (
                                  <Trash
                                  onClick={()=>deleteComment(comment.id )}
                                  className="cursor-pointer text-red-500 "
                                  size={12}  />
                            )
                        }
                    </span>

                  </div>
                  <p className="text-sm text-stone-600 font-sans leading-relaxed">
                    {comment?.comment ?? "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-stone-400 font-sans text-sm">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </section>
      </article>
    </div>
  );
}