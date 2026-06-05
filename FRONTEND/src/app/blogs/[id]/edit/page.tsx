import { GET_BLOG_BY_ID } from '@/api/blogApi';
import React from 'react'
import EditClientPage from './EditClientPage';


interface Props {
  params: Promise<{ id: string }>;
}
 



const EditBlogServerPage =async ({ params }: Props) => {

 const { id } = await params;
 const data = await GET_BLOG_BY_ID(id);
  return (
    <EditClientPage 
    blogData={data}
    />
  )
}

export default EditBlogServerPage;