"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import JoditEditor from "jodit-react";
import { Sparkles, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOG_AI_PARAGRAPH_CORRECTOR_API, BLOG_AI_TITLE_CORRECTOR_API, CREATE_BLOG_API } from "@/api/blogApi";
import toast from "react-hot-toast";
import { BLOG_AI_CONTENT_GRAMMER_CORRECTOR_API } from "../../../api/blogApi";
import { useRouter } from "next/navigation";

const categories = [
  "Technology",
  "Programming",
  "Travel",
  "Business",
  "Education",
  "Lifestyle",
  "Health",
  "Sports",
];

const AddNewBlogsPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    blogContent: "",
    category: "",
  });
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [isCorrectingTitle, setIsCorrectingTitle] = useState(false);
  const [isCorrectingDescription, setIsCorrectingDescription] = useState(false);
  const [isCorrectingBlog,setIsCorrectingBlog] = useState(false);


  //=============================== AI ENHANCE FUNCTIONS START ===============================================
  const aiTitleCorrectorHandler = async () => {
  if (!formData.title.trim()) return;

  setIsCorrectingTitle(true);

  try {
    const res = await BLOG_AI_TITLE_CORRECTOR_API(formData.title);

    if (res?.success) {
      setFormData((prev) => ({
        ...prev,
        title: res.data,
      }));
    }
    else{
      toast.error(res?.response ?? "Technical issue occured while correcting title. Please try again later.");
    }
  } finally {
    setIsCorrectingTitle(false);
  }
};

  const aiDescriptionGeneratorOrCorrectorHandler = async () => {
    if(!formData.title){
      return toast.error("Please provide a title first.");
    }
  setIsCorrectingDescription(true);
  try {
    toast.loading(!formData?.description || formData?.description === "" ? "Generating description" : "Correcting description" );
    const res = await BLOG_AI_PARAGRAPH_CORRECTOR_API(formData.title, formData.description);
    toast.dismiss();

    if (res?.success) {
      setFormData((prev) => ({
        ...prev,
        description: res.data,
      }));
    }
    else{
      toast.error(res?.response ?? "Technical issue occured while correcting title. Please try again later.");
    }
  } finally {
    setIsCorrectingDescription(false);
  }
};
  

  const aiBlogContentGrammerCorrectorHandler = async () => {
    if(!formData?.blogContent){
      return toast.error("Please provide blogContent first.");
    }
    setIsCorrectingBlog(true)
    try {
    toast.loading("Correcting Blog content..." );
    const res = await BLOG_AI_CONTENT_GRAMMER_CORRECTOR_API(formData?.blogContent);
    toast.dismiss();
    if (res?.success) {
      setFormData((prev) => ({
        ...prev,
        blogContent: res.data,
      }));
    }
    else{
      toast.error(res?.response ?? "Technical issue occured while correcting title. Please try again later.");
    }
  } finally {
    setIsCorrectingBlog(false);
  }
};
  
  //=============================== AI ENHANCE FUNCTIONS END ===============================================
  
  const inputChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData();

    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("blogContent", formData.blogContent);
    payload.append("category", formData.category);

    if (image) {
      payload.append("image", image);
    }
    setLoading(true);
    const res = await CREATE_BLOG_API(payload);
    setLoading(false);
    if (res?.success) {
      toast.success("Blog Created Successfully");
      setFormData({
        title: "",
        description: "",
        blogContent: "",
        category: "",
      });
      setImage(null);
      setPreview("");
      router.push("/blogs");
    } else {
      toast.error(
        res?.response ??
          "Technical Issue in login. Please try again later.",
      );
    }
  };

  //------------------ jodit-editor start ==============================

  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Start typings...",
    }),
    [],
  );

  //------------------ jodit-editor end ==============================

  //----------- IMAGE SETUP START -----------
  const imageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  //----------- IMAGE SETUP END -----------

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-screen-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Blog</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={submitHandler} className="space-y-6">
              {/* <div>
                <label className="text-sm font-medium">Blog Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  required
                  onChange={inputChangeHandler}
                  placeholder="Enter blog title"
                />
              </div> */}


{/*BLOG TITLE  */}
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium">
      Blog Title
    </label>

    {formData.title.trim() && (
      <button
        type="button"
        onClick={aiTitleCorrectorHandler}
        disabled={isCorrectingTitle}
        className="
          flex items-center gap-1
          text-xs
          px-2 py-1
          rounded-md
          bg-black
          text-white
          cursor-pointer
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {isCorrectingTitle ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Sparkles className="h-3 w-3" />
        )}

        AI Fix
      </button>
    )}
  </div>

  <Input
    name="title"
    value={formData.title}
    required
    onChange={inputChangeHandler}
    placeholder="Enter blog title"
  />
</div>

{/*DESCRIPTION */}
              <div className="flex items-end-safe  gap-2 " >
                <div className="w-full max-w-full">
                <label className="text-sm font-medium">Description</label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={inputChangeHandler}
                  placeholder="Short description"
                />
                </div>

<div className="inline">
                {
                  formData?.description ? (
     <button
        type="button"
        onClick={aiDescriptionGeneratorOrCorrectorHandler}
        disabled={isCorrectingDescription}
        className="
          flex items-center gap-1
          text-xs
          px-2 py-1
          rounded-md
          bg-black
          text-white
          cursor-pointer
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {isCorrectingDescription ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Sparkles className="h-3 w-3" />
        )}

        AI Fix
      </button>
                  ):(
      <button
        type="button"
        onClick={aiDescriptionGeneratorOrCorrectorHandler}
        disabled={isCorrectingDescription}
        className="
          flex items-center gap-1
          text-xs
          px-2 py-2
          rounded-md
          bg-black
          text-white
          cursor-pointer
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {isCorrectingDescription ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Sparkles className="h-3 w-3" />
        )}
      </button>
                  )
                }
</div>

              </div>

              <div className="w-full">

              {formData?.blogContent?.trim() && (
      <button
        type="button"
        onClick={aiBlogContentGrammerCorrectorHandler}
        disabled={isCorrectingBlog}
        className="
        block ml-auto
        mb-2
          flex items-center gap-1
          text-xs
          px-2 py-1
          rounded-sm
          bg-black
          text-white
          cursor-pointer
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {isCorrectingBlog ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Sparkles className="h-3 w-3" />
        )}

        AI Content Fix
      </button>
    )}

                <JoditEditor
                  ref={editor}
                  value={formData.blogContent}
                  config={config}
                  tabIndex={1} // tabIndex of textarea
                  onBlur={(newContent) =>
                    setFormData({ ...formData, blogContent: newContent })
                  } // preferred to use only this option to update the content for performance reasons
                  onChange={(newContent) => {}}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>

                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

     

              {/*IMAGE START  */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Featured Image</label>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={imageChangeHandler}
                />

                {preview && (
                  <div className="border rounded-md overflow-hidden">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
              </div>

              {/*IMAGE END  */}

              <Button
              disabled={loading}
              type="submit" className="w-full cursor-pointer">
                {
                  loading ?(
                    <span>
                      Publishing Blog...
                    </span>
                  ):(
<span>
  Publish Blog
</span>
                  )
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddNewBlogsPage;
