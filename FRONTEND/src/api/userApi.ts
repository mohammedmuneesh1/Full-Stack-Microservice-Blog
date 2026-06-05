"use server"

import axiosErrorHandler from "@/utils/axiosErrorHandler";
import axiosInstance from "@/utils/axiosInstance";
import { USER_SERVICE_URL } from "@/utils/urls";
import { cookies } from "next/headers";

export async function FETCH_USER_PROFILE (){
    
    try {
        const cookie = await cookies();
        const token = cookie.get('token')?.value;
        if(!token) return {
            tokenExist:false,
            success:false,
            data:null,
            response:'Unauthorized access'
        }
          const response = await axiosInstance.get('/api/users/profile',{
            baseURL:USER_SERVICE_URL,
          });
          return {
            tokenExist:true,
            success:response?.data?.success,
            data:response?.data?.data ?? null,
          }

        
    } catch (error) {
        return {
            success:false,
            data:null,
            tokenExist:false,
        }
    }


}


export async function USER_LOGIN(code:string){
    try {


        const response = await axiosInstance.post("/api/users/login",{
            code
        },
        {
            baseURL:USER_SERVICE_URL as string,
        });

        return response?.data;
    } catch (error) {
        return axiosErrorHandler(error,"USER_LOGIN");
    }
}


export async function UDPATE_USER_PROFILE(formData:FormData){
    try {
        const response = await axiosInstance.put('/api/users/profile/pic',
            formData,
        {
            baseURL:USER_SERVICE_URL as string,
            headers:{
                'Content-Type':'multipart/form-data'
            }
        });
        return response?.data;
    } catch (error) {
        return axiosErrorHandler(error,"UDPATE_USER_PROFILE");
    }
}


 export async function UPDATE_PROFILE_API(data: {
  bio: string;
  instagram: string;
  facebook: string;
  linkedin: string;
}) {
  try {
    const response = await axiosInstance.put(
      `${USER_SERVICE_URL}/api/users/profile`,
      data
    );
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error, "UPDATE_PROFILE");
  }
}
