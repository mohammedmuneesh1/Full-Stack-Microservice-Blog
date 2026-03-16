

"use client"
import React, { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { FETCH_USER_PROFILE } from "@/api/userApi";


export interface AppcontextInterface{ 
    user:UserInterface | null;
    setUser:React.Dispatch<React.SetStateAction<UserInterface | null>>;
    loading:boolean,
    setLoading:React.Dispatch<React.SetStateAction<boolean>>;
    isAuth:boolean | null;
    setIsAuth:React.Dispatch<React.SetStateAction<boolean | null>>;
    fetchUser:()=>Promise<void>;


}



export const Appcontext = createContext<AppcontextInterface | null >(null);




const AppContextProvider = ({children}:{children:React.ReactNode})=>{
    const [isDemo, setIsDemo] = React.useState<boolean>(false);
    const [user,setUser] = React.useState<UserInterface | null>(null);
    const [isAuth,setIsAuth] = useState<boolean | null>(null);
    const [loading,setLoading] = React.useState<boolean>(true);


    async function fetchUser(){
        try {
            const token = Cookies.get('token');
            if(token){
                const res = await FETCH_USER_PROFILE();
                console.log('res',res);
                if(res?.success){
                    setUser(res?.data);
                    setIsAuth(true);
                }
            }
        } catch (error) {
            console.log(error);
            setIsAuth(false); 
            setUser(null);  
        }
        finally{
            setLoading(false);
        }
    }





    function checkAuthenticated(){
        const token = Cookies.get('token');
        console.log('token found here',token);
        if(token){
            setIsAuth(true);
        }
        else{
            setIsAuth(false);
        }
    }

    useEffect(()=>{
        fetchUser();
        checkAuthenticated();
    },[]);

    return (
   <Appcontext.Provider
    value={{ 
    user,setUser,
    loading,setLoading,
    isAuth,setIsAuth,
    fetchUser
    }}>
   {children}
</Appcontext.Provider>
    );
}


export default AppContextProvider;





export const useAppcontext = () =>{
    const context = React.useContext(Appcontext);
    if (!context) {
      throw new Error("useAppcontext must be used within a AppContextProvider");
    }
    return context;
}





export interface UserInterface{
    _id:string,
    name:string,
    email:string;
    image?:string;
    instagram?:string;
    facebook?:string;
    linkedin?:string;
    bio?:string;
    cloudinaryImage:{
        url:string,
        publicId:string
    }
}


export interface BlogInterface{
    id:string;
    title:string;
    description:string;
    blogContent:string;
    image:string;
    category:string;
    author:string;
    createdAt:string;
}