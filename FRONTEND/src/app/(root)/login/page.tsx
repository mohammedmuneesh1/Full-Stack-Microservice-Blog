"use client"


import React, { useEffect } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { USER_LOGIN } from '@/api/userApi';
import { useAppcontext } from '@/context/AppContext';








const LoginPage = () => {


  const router = useRouter();
  const {isAuth ,setLoading,setIsAuth,fetchUser} = useAppcontext();

  // useEffect(() => {
  //   if (isAuth === true) {
  //     router.push("/");
  //   }
  // }, [isAuth, router]);






  //eslint-disable-next-line
const googleLogin = useGoogleLogin({
  flow: "auth-code", // IMPORTANT

  onSuccess: async (response:any) => {
    // response.code ← THIS is what you send to backend
    setLoading(true);
    const res =await USER_LOGIN(response.code);
    setLoading(false);
    if(res?.success){
        // localStorage.setItem("token", res?.data?.token);
        Cookies.set('token', res?.data?.token,{
            expires: 7,
        });
        setIsAuth(true);
        fetchUser();
        // if(res?.data?.isAdmin){
        //     router.push("/admin");
        // }
        // else{
        // router.push("/user/dashboard/bookings");
        // }
        toast.success("Welcome Back");
        return router.push("/profile");
    }
    else{
        toast.error(res?.data?.response ?? "Technical Issue in login. Please try again later.");
    }
  },

  onError: () => {
    setLoading(false);
    console.error("Google login failed");
  },
});




  return (
    <div className=' w-full max-w-full '>

            <Card className="w-full max-w-sm mx-auto mt-[10vh]">
      <CardHeader>
        <CardTitle>Login to the Reding Retreat</CardTitle>
        <CardDescription>
          Go To Your Account
        </CardDescription>

        {/* <CardAction>
        <Button variant="link">Sign In / Sign Up</Button>
        </CardAction> */}

      </CardHeader>
      <CardContent>

         <Button 
         onClick={googleLogin}
         variant="default" className="w-full bg-black text-white cursor-pointer flex items-center gap-2 ">
            <FaGoogle />
          Login with Google
        </Button>

      </CardContent>

      {/* <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
      </CardFooter> */}
    </Card>



    </div>
  )
}

export default LoginPage