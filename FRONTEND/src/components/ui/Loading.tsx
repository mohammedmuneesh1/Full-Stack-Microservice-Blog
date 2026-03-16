"use client"
import { useAppcontext } from '@/context/AppContext'
import React from 'react'

const Loading = () => {
    const {loading} = useAppcontext();
    if(!loading) return null;
 
  return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="text-gray-700 text-sm tracking-wide">
          Loading articles...
        </p>
      </div>
    </div>
  )
}

export default Loading