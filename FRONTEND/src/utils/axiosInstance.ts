

"use server"


import axios from "axios";
import { cookies } from "next/headers";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout:10000,
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials:true,
});


axiosInstance.interceptors.request.use(async (config) => {
    // const token = localStorage.getItem("token");
    const cookie = await cookies();
    const token = cookie.get('token')?.value
    // const token = Cookies.get("token");


    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  });

  //Response Interceptor 

  axiosInstance.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        if(error.response){

    //         if(error.response.status === 401){
                
    //             Cookies.remove('token');

    //             //Redirect to login page 
    //             window.location.href="/auth/login";

    //         // Return a FAKE resolved response so the API doesn't get AxiosError
             
    //         return Promise.resolve({
    //          data: {
    //         success: false,
    //         response:error.response.data?.response ||  "Unauthorized. Please login again.",
    //     },
    //   });


    //   //IMP:
    // //    const res = await axiosInstance.post('/api/auth/user/login', obj);
    // //  return res.data; // now res.data contains your fake object on 401
    //         }


         if (error.response.status === 500){
                console.error('Server error. Please try again later.');
            }
        }
        else if (error.code ==='ECONNABORTED'){
            console.error('Request timed out. Please try again later.');
        }
        return Promise.reject(error);
        // return Promise.reject(error);
// This returns the original AxiosError, which already contains:
// message: "Request failed with status code 401"

    }
);

export default axiosInstance;




// import axios from "axios";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";


// const axiosInstance = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_BASE_URL,
//     timeout:10000,
//     headers:{
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     }
// });

// console.log('process.env.BASE_URL',process.env.BASE_URL);

// axiosInstance.interceptors.request.use(async (config) => {
//     // const token = localStorage.getItem("token");
//     const cookie = await cookies();
//     const token = cookie.get('token')?.value;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   });

//   //Response Interceptor 

//   axiosInstance.interceptors.response.use(
//     (response)=>{
//         return response;
//     },
//     (error)=>{
//         if(error.response){
//             if(error.response.status === 401){
//                 //Redirect to login page 
//                 // window.location.href="/auth/login";
//               return redirect("/auth/login");
//             }
//             else if (error.response.status === 500){
//                 console.error('Server error. Please try again later.');
//             }
//         }
//         else if (error.code ==='ECONNABORTED'){
//             console.error('Request timed out. Please try again later.');
//         }
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;











//CLIENT SIDE CODE 
