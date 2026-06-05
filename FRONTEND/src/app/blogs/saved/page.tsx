import { GET_ALL_SAVED_BLOGS } from "@/api/blogApi";
import SavedClientPage from "./SavedClientPage";


const SavedBlogServerPage =async()=>{
    const data = await GET_ALL_SAVED_BLOGS(); 
    return(
        <SavedClientPage
        blogData={data}
        />
    )
}

export default SavedBlogServerPage;