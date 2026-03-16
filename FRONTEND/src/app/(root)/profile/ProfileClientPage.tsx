"use client"
import { UDPATE_USER_PROFILE } from '@/api/userApi';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useAppcontext } from '@/context/AppContext'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { BsFacebook, BsInstagram, BsLinkedin } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';

const ProfileClientPage = () => {

    const {user,setUser,isAuth} = useAppcontext();
    const {setLoading,loading} = useAppcontext();

    const fileChangeHandler = async (e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];
        if(!file) return;
        setLoading(true);
       const formData = new FormData();
       formData.set('image',file);

       const res = await UDPATE_USER_PROFILE(formData);
       setLoading(false);
       if(res?.success) {
         setUser(res?.data);
         toast.success("Profile pic updated successfully");
       }
       else{
        toast.error(res?.data?.response ?? "Technical Issue in login. Please try again later.");
       }
    }


    const router = useRouter();
    useEffect(()=>{
        if(isAuth === false){
            return router.push("/login");
        }
    },[]);

  return (
    <div
     className='flex justify-center 
     items-center min-h-screen p-4'
     >
        <Card className='w-full max-w-xl shadow-lg border rounded-2xl p-6'>

            <CardTitle
            
            className='text-2xl font-bold text-center'>
                Profile
            </CardTitle>
            <CardContent
            className='flex flex-col items-center space-y-4'
            >


{/* PROFILE IMAGE START */}
                <div
                id="profile-img"
                className='relative rounded-full bg-gray-300'
                >
                    
                {
                  user?.cloudinaryImage && user?.cloudinaryImage?.url ? (
                        <Avatar
                        className=' w-20 h-20 sm:w-28 sm:h-28 border-4 border-gray-300 shadow-md cursor-pointer '
                        >
                        <AvatarImage
                        src={user?.cloudinaryImage?.url }
                        alt='profile pic'
                        />
                    </Avatar>
                    ):(
                          user  && user?.image ? (
                        <Avatar
                        className=' w-20 h-20 sm:w-28 sm:h-28 border-4 border-gray-300 shadow-md cursor-pointer '
                        >
                        <AvatarImage
                        src={user?.image}
                        alt='profile pic'
                        />
                        </Avatar>
                        ):(
                        <div
                        className=' w-20 h-20 sm:w-28 sm:h-28 border-4 border-gray-300 shadow-md cursor-pointer bg-blue-400'
                        >
                            {user?.name.split(" ")?.map((val)=>val[0])?.join(" ")}
                        </div>
                        )
                    )
                }
{/* PROFILE IMAGE EDIT START HERE */}

<div
className='absolute bottom-0 right-5'
>


<label 
htmlFor="profile-pic">
<CiEdit
className=' text-xl sm:text-2xl text-cyan-600 cursor-pointer'
/>
</label>

<input
 type="file"
 id="profile-pic"
 className='hidden'
accept="image/*"
onChange={fileChangeHandler}
/>
</div>

{/* PROFILE IMAGE EDIT END HERE */}
                </div>
                {/* PROFILE IMAGE START */}




{/* NAME + SOCIAL MEDIA START */}

<div
 className='flex flex-col items-center gap-2'
 >

{/* START  */}
    <div className='text-center'>
        <h2
         className=' text-sm sm:text-base font-bold text-gray-800' 
         >Name</h2>
        <h3
        className=' text-xs sm:text-sm font-medium text-black' 
        >{user?.name ?? "NA"}</h3>
    </div>

{/* BIO  */}
    <div className='text-center  '>
        <h2
        className=' text-sm sm:text-base font-bold text-gray-800  ' 
        >Bio</h2>
        <h3
        className=' text-xs sm:text-sm font-medium text-black' 
        >{user?.bio ?? "NA"}</h3>
    </div>
    {/* SOCIAL MEDIA */}
    <div className='text-center flex justify-center gap-3'>
        {
            user?.instagram && (
                <BsInstagram
        className=' text-2xl sm:text-3xl text-red-400 cursor-pointer'
        />
            )
        }

        {
            user?.linkedin && (
        <BsLinkedin
        className=' text-2xl sm:text-3xl text-blue-800 cursor-pointer'
        />
            )
        }
        {
            user?.facebook && (

        <BsFacebook
        className=' text-2xl sm:text-3xl text-cyan-700 cursor-pointer'
        />
            )
        }

        


        
    </div>



    <div className='flex flex-col sm:flex-row gap-2 mt-6 w-full justify-center'>

        <Button className='rounded-sm'
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        >Logout</Button>
        <Button className='rounded-sm'>Add Blog</Button>

    </div>


</div>



{/* NAME + SOCIAL MEDIA END */}
<div >


</div>


            </CardContent>
        </Card>
    </div>
  )
}

export default ProfileClientPage