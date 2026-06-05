"use server"

import axiosErrorHandler from "@/utils/axiosErrorHandler";
import axiosInstance from "@/utils/axiosInstance";
import { AUTHOR_SERVICE_URL, BLOG_SERVICE_URL } from "@/utils/urls";

 export async function CREATE_BLOG_API(formData:FormData) {
  try {
    const response = await axiosInstance.post(
      `/api/authors/`,formData,
      {
        baseURL: AUTHOR_SERVICE_URL as string,
        headers: {
          "Content-Type": "multipart/form-data",
    },
      }
    );
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "CREATE_BLOG_API");
  }
}

 export async function EDIT_BLOG_API(blogId:string,formData:FormData) {
  try {
    const response = await axiosInstance.put(
      `/api/authors/${blogId}`,formData,
      {
        baseURL: AUTHOR_SERVICE_URL as string,
        headers: {
          "Content-Type": "multipart/form-data",
    },
      }
    );
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "EDIT_BLOG_API");
  }
}



 export async function BLOG_AI_TITLE_CORRECTOR_API(text:string) {
  try {
    const response = await axiosInstance.post(
      `/api/authors/ai/title`,{
        text
      },
      {
        baseURL: AUTHOR_SERVICE_URL as string,
        
      }
    );
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "CREATE_BLOG_API");
  }
}


 export async function BLOG_AI_PARAGRAPH_CORRECTOR_API(title:string,description?:string) {
  try {
    const response = await axiosInstance.post(
      `/api/authors/ai/description`,{
        title,
        description
      },
      {
        baseURL: AUTHOR_SERVICE_URL as string,
        
      }
    );
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "CREATE_BLOG_API");
  }
}

export async function BLOG_AI_CONTENT_GRAMMER_CORRECTOR_API(blog:string) {
  try {
    const response = await axiosInstance.post(
      `/api/authors/ai/blog`,{
        blog,
      },
      {
        timeout:60000, // 60 seconds 
        baseURL: AUTHOR_SERVICE_URL as string,
      }
    );
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "CREATE_BLOG_API");
  }
}


 export async function GET_ALL_BLOGS(searchQry?:string) {
  try {
    const api:string = "/api/blogs/all?";
    const response = await axiosInstance.get(api+searchQry,{
      baseURL:BLOG_SERVICE_URL
    });
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "GET_ALL_BLOGS");
  }
}


export async function GET_BLOG_BY_ID(id:string){
  try {
    const response = await axiosInstance.get(`/api/blogs/${id}`,{
      baseURL:BLOG_SERVICE_URL
    });
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "GET_ALL_BLOGS");
  }

}

export async function GET_BLOG_COMMENTS(id:string){
  try {
    const response = await axiosInstance.get(`/api/blogs/comments/${id}`,{
      baseURL:BLOG_SERVICE_URL
    });
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "GET_ALL_BLOGS");
  }
}


export async function POST_BLOG_COMMENT (id:string,comment:string){
  try {
    const response = await axiosInstance.post(`/api/blogs/comments/${id}`,
      {
        comment
      },
      {
      baseURL:BLOG_SERVICE_URL
    });
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "POST_BLOG_COMMENT");
  }
}

export async function DELETE_BLOG_COMMENT(id:string,commentId:number){
  try {
    const response = await axiosInstance.delete(`/api/blogs/comments/${id}/${commentId}`,
      {
      baseURL:BLOG_SERVICE_URL
    });
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "DELETE_BLOG_COMMENT");
  }
}

export async function SAVE_OR_REMOVE_BLOG(id: string) {
  try {
    const response = await axiosInstance.put(
      `/api/blogs/save-remove/${id}`,
      {},
      {
        baseURL: BLOG_SERVICE_URL,
      }
    );

    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "SAVE_OR_REMOVE_BLOG");
  }
}



export async function GET_ALL_SAVED_BLOGS(){
  try {
    const response = await axiosInstance.get(`/api/blogs/saved`,{
      baseURL:BLOG_SERVICE_URL
    });
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "GET_ALL_BLOGS");
  }
}
export async function GET_USER_OWN_BLOGS(){
  try {
    const response = await axiosInstance.get(`/api/blogs/own-blogs`,{
      baseURL:BLOG_SERVICE_URL
    });
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "GET_USER_OWN_BLOGS");
  }
}

export async function DELETE_BLOG(id: string) {
  try {
    const response = await axiosInstance.delete(`/api/authors/${id}`,{
      baseURL: AUTHOR_SERVICE_URL as string,
    });
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "DELETE_BLOG");
  }
}