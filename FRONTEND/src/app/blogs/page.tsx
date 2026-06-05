import { GET_ALL_BLOGS } from "@/api/blogApi";
import BlogAllClientPage from "./BlogAllClientPage";


interface ShopSearchParams{

  category:string;
  searchQuery:string;
}
 




const BlogServerPage =async ({ searchParams }: { searchParams: Promise<ShopSearchParams> })=>{
  
  const searchParams1 = await searchParams;
  const urlPayload:Array<string> = [];
  Object.entries(searchParams1).forEach(([key, value]) => {
      if (value !== null && value !== "") {
          urlPayload.push(`${key}=${value}`);
      }
  });
  const queryUrl = urlPayload.join("&")
const data = await GET_ALL_BLOGS(queryUrl);
    return(
        <>
       <BlogAllClientPage
       data={data?.data ?? []}
       />
    </>
    )
}


export default BlogServerPage;