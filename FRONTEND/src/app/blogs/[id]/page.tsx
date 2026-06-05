// app/blogs/[id]/page.tsx  (Server Component)
import { GET_BLOG_BY_ID, GET_BLOG_COMMENTS } from "@/api/blogApi";
import BlogDetailClientPage from "./BlogByIdClientPage";
 
interface Props {
  params: Promise<{ id: string }>;
}
 
export default async function BlogByIdPage({ params }: Props) {
    const { id } = await params;
  const [blog, comments] = await Promise.all([
    GET_BLOG_BY_ID(id),
    GET_BLOG_COMMENTS(id),
  ]);

 
  return <BlogDetailClientPage
    blogData={blog}
    commentsData={comments}
    blogId={id} 
     />;
}
 