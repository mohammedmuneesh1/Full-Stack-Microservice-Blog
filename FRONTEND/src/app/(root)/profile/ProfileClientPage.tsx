"use client";
import { UDPATE_USER_PROFILE, UPDATE_PROFILE_API } from "@/api/userApi";
import { GET_USER_OWN_BLOGS, DELETE_BLOG } from "@/api/blogApi";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppcontext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsFacebook, BsInstagram, BsLinkedin } from "react-icons/bs";
import { Camera, Trash2, Edit3, LogOut, Plus, Pencil, CalendarDays } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Blog {
  id: number;
  title: string;
  description: string;
  blogcontent: string;
  image: { url: string; publicId: string };
  category: string;
  author: string;
  createdat: string;
  updatedat?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "bg-teal-50 text-teal-700",
  Programming: "bg-purple-50 text-purple-700",
  Travel: "bg-amber-50 text-amber-700",
  Business: "bg-blue-50 text-blue-700",
  Education: "bg-green-50 text-green-700",
  Lifestyle: "bg-pink-50 text-pink-700",
  Health: "bg-red-50 text-red-700",
  Sports: "bg-orange-50 text-orange-700",
};

const ProfileClientPage = () => {
  const { user, setUser, isAuth, logoutFn } = useAppcontext();
  const { setLoading, loading } = useAppcontext();
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    bio: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.set("image", file);
    const res = await UDPATE_USER_PROFILE(fd);
    setLoading(false);
    if (res?.success) {
      setUser(res?.data);
      toast.success("Profile photo updated");
    } else {
      toast.error(res?.data?.response ?? "Failed to update photo");
    }
  };

  useEffect(() => {
    if (isAuth === false) router.push("/login");
  }, [isAuth]);

  const fetchUserBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await GET_USER_OWN_BLOGS();
      if (res?.success) setUserBlogs(res?.data || []);
      else toast.error(res?.data?.response || "Failed to fetch blogs");
    } catch {
      toast.error("Failed to fetch your blogs");
    } finally {
      setBlogsLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: number) => {
    if (!confirm("Delete this blog? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await DELETE_BLOG(String(blogId));
      if (res?.success) {
        toast.success("Blog deleted");
        setUserBlogs((prev)=> prev.filter((val)=>val?.id !== blogId))
      } else {
        toast.error(res?.response || "Failed to delete");
      }
    } catch {
      toast.error("Error deleting blog");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    const res = await UPDATE_PROFILE_API(formData);
    setLoading(false);
    if (res?.success) {
      setUser(res.data?.user);
      toast.success("Profile updated");
      setDialogOpen(false);
    } else {
      toast.error(res?.data?.response || "Failed to update profile");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBlogs();
      setFormData({
        bio: user?.bio || "",
        instagram: user?.instagram || "",
        facebook: user?.facebook || "",
        linkedin: user?.linkedin || "",
      });
    }
  }, [user]);

  const initials = user?.name
    ?.split(" ")
    ?.map((v: string) => v[0])
    ?.join("")
    ?.slice(0, 2)
    ?.toUpperCase();

  const getAvatarSrc = () => {
    if (user?.cloudinaryImage?.url) return user.cloudinaryImage.url;
    if (user?.image) return user.image;
    return null;
  };

  const avatarSrc = getAvatarSrc();

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* ── Profile card ── */}
      <div className=" mx-auto px-4 pt-12 pb-6">
        <div className="bg-white rounded-2xl border border-stone-100 p-8">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              {avatarSrc ? (
                <Avatar className="w-24 h-24 border-2 border-stone-200">
                  <AvatarImage src={avatarSrc} alt="profile" />
                </Avatar>
              ) : (
                <div className="w-24 h-24 rounded-full bg-teal-50 border-2 border-stone-200 flex items-center justify-center text-teal-700 text-2xl font-medium">
                  {initials}
                </div>
              )}
              <label
                htmlFor="profile-pic"
                className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors"
                title="Change photo"
              >
                <Camera size={13} className="text-stone-500" />
              </label>
              <input
                type="file"
                id="profile-pic"
                className="hidden"
                accept="image/*"
                onChange={fileChangeHandler}
              />
            </div>

            <h1 className="text-xl font-semibold text-stone-800">{user?.name ?? "—"}</h1>
            {user?.bio && (
              <p className="text-sm text-stone-500 mt-1 text-center max-w-sm leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Social links */}
            {(user?.instagram || user?.linkedin || user?.facebook) && (
              <div className="flex gap-3 mt-3">
                {user?.instagram && (
                  <a href={user.instagram} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-100 transition-colors">
                    <BsInstagram className="text-rose-400" size={13} /> Instagram
                  </a>
                )}
                {user?.linkedin && (
                  <a href={user.linkedin} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-100 transition-colors">
                    <BsLinkedin className="text-blue-700" size={13} /> LinkedIn
                  </a>
                )}
                {user?.facebook && (
                  <a href={user.facebook} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-100 transition-colors">
                    <BsFacebook className="text-blue-500" size={13} /> Facebook
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { value: userBlogs.length, label: "blogs" },
              { value: new Set(userBlogs.map((b) => b.category)).size, label: "categories" },
              { value: user?.createdAt ? new Date(user.createdAt).getFullYear() : "—", label: "joined" },
            ].map((s) => (
              <div key={s.label} className="bg-stone-50 rounded-xl p-3 text-center">
                <div className="text-xl font-semibold text-stone-800">{s.value}</div>
                <div className="text-xs text-stone-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap justify-center">
            {/* Edit dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-lg text-xs gap-1.5">
                  <Pencil size={13} /> Edit profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-stone-500 mb-1 block">Bio</label>
                    <Textarea
                      name="bio"
                      placeholder="Tell readers about yourself..."
                      value={formData.bio}
                      onChange={handleChange}
                      className="resize-none text-sm rounded-lg min-h-[80px]"
                    />
                  </div>
                  {["instagram", "facebook", "linkedin"].map((field) => (
                    <div key={field}>
                      <label className="text-xs text-stone-500 mb-1 block capitalize">{field} URL</label>
                      <Input
                        type="text"
                        name={field}
                        placeholder={`https://${field}.com/yourhandle`}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        className="text-sm rounded-lg"
                      />
                    </div>
                  ))}
                  <Button
                    onClick={updateProfile}
                    disabled={loading}
                    className="w-full rounded-lg mt-1"
                    size="sm"
                  >
                    {loading ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              size="sm"
              className="rounded-lg text-xs gap-1.5 bg-stone-800 hover:bg-stone-700"
              onClick={() => router.push("/blogs/new")}
            >
              <Plus size={13} /> New blog
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs gap-1.5 text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => logoutFn()}
            >
              <LogOut size={13} /> Logout
            </Button>
          </div>
        </div>
      </div>

      {/* ── My blogs section ── */}
      <div className=" px-4 pb-16">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800">My blogs</h2>
          <span className="text-sm text-stone-400">{userBlogs.length} published</span>
        </div>

        {blogsLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-stone-400" />
          </div>
        ) : userBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-stone-400 text-sm mb-4">No blogs yet. Start writing!</p>
            <Button
              size="sm"
              className="rounded-lg gap-1.5 bg-stone-800 hover:bg-stone-700"
              onClick={() => router.push("/blogs/new")}
            >
              <Plus size={13} /> Create your first blog
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
            {userBlogs.map((blog) => {
              const date = new Date(blog.createdat).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric",
              });
              const colorClass = CATEGORY_COLORS[blog.category] ?? "bg-stone-100 text-stone-600";

              return (
                <article
                  key={blog.id}
                  className="group bg-white rounded-2xl border border-stone-100 hover:border-stone-200 overflow-hidden flex flex-col transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative w-full h-40 bg-stone-50 overflow-hidden">
                    {blog.image?.url ? (
                      <Image
                        src={blog.image.url}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-200 text-4xl font-serif">
                        ✦
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 text-[10px] font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
                      {blog.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-stone-800 leading-snug mb-1.5 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 flex-1">
                      {blog.description}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1 text-[11px] text-stone-400">
                        <CalendarDays size={11} />
                        {date}
                      </div>

                      {user?._id === blog.author && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => router.push(`/blogs/${blog.id}/edit`)}
                            className="w-7 h-7 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            disabled={loading}
                            className="w-7 h-7 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileClientPage;