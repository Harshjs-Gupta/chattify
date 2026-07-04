"use client";
import AmbientBackground from "@/components/AmbientBackground";
import ScatteredDots from "@/components/ScatteredDots";
import {
  Camera,
  User,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useState, FormEvent } from "react";
import { useForm } from "react-hook-form";
import Field from "@/components/Field";
import SignInLogoIllustration from "@/components/UI/signInLogoIllustration";
import { auth, database } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { upload } from "@/lib/upload";
import { useRouter } from "next/navigation";

type FormType = {
  avatar: FileList;
  username: string;
  email: string;
  password: string;
};

const errorStyle = "mt-2 ml-2 text-xs text-red-600";
const errorInputStyle = "border-red-400 border-2 outline-red-500";
const inputStyle =
  "flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground text-foreground";

export default function page() {
  // UseForm Hook to manage all form state and validation
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormType>();
  const avatar = watch("avatar");
  const preview = avatar?.length ? URL.createObjectURL(avatar[0]) : null;
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Handle form submission
  const onSubmit = async (data: FormType) => {
    setIsLoading(true);
    try {
      const file = data.avatar[0];
      if (!file) {
        toast.error("Profile picture is required.");
        return;
      }

      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      // Here i fetch uploaded image from cloudinary
      const imageUrl = await upload(file);

      await setDoc(doc(database, "users", res.user.uid), {
        username: data.username,
        usernameLower: data.username.toLowerCase(),
        email: data.email,
        avatar: imageUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(database, "userChats", res.user.uid), {
        chats: [],
      });

      toast.success("Account successfully connected! You can login now!");
      reset();
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
      router.push("/login-page");
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#06030f] text-white">
      {/* Ambient background glow */}
      <AmbientBackground right_left="right" top_bottom="top" />

      {/* Scattered dots */}
      <ScatteredDots right_left="left" top_bottom="top" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 pb-16 pt-8 sm:px-10 lg:px-16">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <MessageCircle className="h-7 w-7 text-violet-400" strokeWidth={2} />
          <span className="text-xl font-bold tracking-tight">Chattify</span>
        </div>

        {/* Main content */}
        <div className="mt-8 grid grid-cols-1 items-center justify-center gap-12 lg:mt-8 lg:grid-cols-2 lg:gap-8">
          {/* Left: Sign in content */}
          <div className="flex flex-col items-center gap-4 xl:ml-10">
            {/* Heading: Create account */}
            <h1 className="font-extrabold leading-[1.05] space-y-2 tracking-tight">
              <span className="block text-xl sm:text-xl md:text-2xl uppercase text-[#6935C6]">
                Create a new account
              </span>
              <span className="text-white text-base font-light text-center block">
                Join our community and start chatting
              </span>
            </h1>
            {/* Sign In Form section */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col items-center gap-5 max-w-md"
            >
              {/* Profile Pic upload */}
              <label htmlFor="file" className="flex gap-7 items-center w-full">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="object-contain h-28 w-40"
                  />
                ) : (
                  <div className="h-28 w-40 flex items-center justify-center border rounded-lg bg-white/3 border-dashed border-[#6935C6]">
                    <Camera className="w-10 h-10 text-[#6935C6]" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <span className="font-bold text-[#6935C6]">
                    Upload an image
                  </span>
                  <span
                    className={`${!preview && errors.avatar?.message && "text-red-600"} font-medium`}
                  >
                    Profile pic is required{" "}
                    <span className="text-red-400">*</span>
                  </span>
                </div>
              </label>
              <input
                type="file"
                id="file"
                hidden
                accept="image/*"
                {...register("avatar", {
                  required: "Profile picture is required",
                })}
              />
              {/* Username Field */}
              <Field
                label="UserName"
                icon={User}
                error={errors.username?.message}
              >
                <input
                  type="username"
                  className={`${errors.username} ${inputStyle}`}
                  placeholder="Enter your username"
                  {...register("username", {
                    required: "Username is required*",
                  })}
                />
              </Field>
              {/* Email Field */}
              <Field label="Email" icon={Mail} error={errors.email?.message}>
                <input
                  type="email"
                  className={`${errors.email} ${inputStyle}`}
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required*" })}
                />
              </Field>
              {/* Password Field */}
              <Field
                label="Password"
                icon={Lock}
                error={errors.password?.message}
              >
                <input
                  type={`${showPwd ? "text" : "password"}`}
                  className={`${errors.password} ${inputStyle} `}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="transition-colors text-muted-foreground hover:text-violet-300"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.75} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.75} />
                  )}
                </button>
              </Field>
              {/* Sign In button */}
              <button
                type="submit"
                className="bg-[#6935C6] cursor-pointer hover:bg-[#6935C6]/70 active:bg-[#6935C6]/90 font-bold w-full text-white p-3 rounded-md transition-colors"
              >
                <span className={`${isLoading ? "animate-ping" : ""}`}>
                  {isLoading ? "Submitting..." : "Sign In"}
                </span>
              </button>
              {/* Already have an account? Log In link */}
              <div className="w-full flex items-center justify-between">
                <p className="pt-2 text-sm text-center text-muted-foreground">
                  Already have an account?
                  <a
                    href="/login-page"
                    className="ml-2 font-medium text-violet-400 hover:text-violet-300"
                  >
                    Log In
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Left: Messenger Logo Illustration */}
          <SignInLogoIllustration />
        </div>
      </div>
    </main>
  );
}
