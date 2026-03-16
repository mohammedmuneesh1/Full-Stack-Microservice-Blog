"use client";


import Link from 'next/link';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { LogIn, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppcontext } from '@/context/AppContext';


const Navbar = () => {
   const [isOpen, setIsOpen] = useState(false);
   const {isAuth} = useAppcontext();
  return (
    <nav className='bg-white shadow-md py-4  px-6 md:px-8  z-50'>
        <div className='container mx-auto flex justify-between items-center gap-4'>
            <Link href={"/"} >
                <h1 className='text-2xl font-bold text-gray-700'> The Reading Retreat </h1>
            </Link>

            <div className='md:hidden'>
                <Button variant={"ghost"} onClick={()=> setIsOpen(!isOpen)}>
                    {
                        isOpen ?
                         <X className="w-6 h-6" /> :
                         <Menu className="w-6 h-6" />
                    }
                </Button>
            </div>


            <ul
             className="hidden md:flex justify-center items-center space-x-6 text-gray-700"
             >

                <li ><Link href={"/"} className="hover:text-blue-500 " >Home</Link></li>
                <li ><Link href={"/blog/saved"} className="hover:text-blue-500 " >Saved Blogs</Link></li>
                {
                    isAuth ? (
                        <li ><Link href={"/profile"} className="hover:text-blue-500 " >profile</Link></li>

                    ):(
<li ><Link href={"/login"} className="hover:text-blue-500 " ><LogIn/></Link></li>
                    )
                }
                


            </ul>





        </div>



        {/*THE MOBILE NAV START */}

        <div
         className={cn("md:hidden overflow-hidden transition-all duration-300 ease-in-out",isOpen ? "max-h-40 opacity-100":"max-h-0 opacity-0 ")}>


            <ul
            className="flex flex-col justify-center p-4 items-center space-y-4 text-gray-700 bg-white shadow-md ">


                           <li ><Link href={"/"} className="hover:text-blue-500 " >Home</Link></li>
                <li ><Link href={"/blog/saved"} className="hover:text-blue-500 " >Saved Blogs</Link></li>
                <li ><Link href={"/login"} className="hover:text-blue-500 " ><LogIn/></Link></li>


            </ul>


        </div>
        {/*THE MOBILE NAV END */}
    </nav>
  )

}

export default Navbar;