import axios from "axios";
import { redirect } from "next/navigation";

const axiosErrorHandler =async(error: unknown, fn: string) => {


    
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
            console.error(`Error occurred in ${fn} 401:`, error.response?.data ?? "Technical issue occurred. Refresh the page and try again. If it persists, contact support."); 
          return {
                success: false,
                authError:true,
                response: "Session expired. Please sign in again.",
              }
            }
          
        console.error(`Error occurred in ${fn}:`, error.response?.data ?? "Technical issue occurred. Refresh the page and try again. If it persists, contact support."); ;
        return {
            success: false,
            response: error.response?.data?.response ??  'Technical issue occurred. Refresh the page and try again. If it persists, contact support.'
        };
    }
    console.error(`Error occurred in  ${fn}:`, error);
    return {
        success: false,
        response: error instanceof Error ? error?.message ?? "" : "Network issue occurred. Please try again later."
    };
};


export default axiosErrorHandler;