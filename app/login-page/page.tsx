"use client";
import AmbientBackground from "@/components/AmbientBackground";
import ScatteredDots from "@/components/ScatteredDots";
import { Eye, EyeOff, Lock, Mail, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Field from "@/components/Field";
import LogInLogoIllustration from "@/components/UI/logInLogoIllustration";
import { toast } from "react-toastify";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

const errorStyle = "mt-2 ml-2 text-xs text-red-600";
const errorInputStyle = "border-red-400 border-2 outline-red-500";
const inputStyle =
  "flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground text-foreground";

type FormType = {
  email: string;
  password: string;
};

export default function page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>();
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(data: FormType) {
    setIsLoading(true);
    const { email, password } = data;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("You log in Successfully!");
      // console.log(data, "Form submitted");
    } catch (err) {
      if (err instanceof Error) {
        // console.log(err);
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
      if (auth) {
        router.push("/friends-chat-list");
      }
    }
    reset();
  }
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#06030f] text-white">
      {/* Ambient background glow */}
      <AmbientBackground right_left="left" top_bottom="bottom" />

      {/* Scattered dots */}
      <ScatteredDots right_left="left" top_bottom="top" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 pb-16 pt-8 sm:px-10 lg:px-16">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <MessageCircle className="h-7 w-7 text-violet-400" strokeWidth={2} />
          <span className="text-xl font-bold tracking-tight">Chattify</span>
        </div>

        {/* Main content */}
        <div className="mt-12 grid grid-cols-1 items-center justify-center gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-8">
          {/* Left: Messenger Logo Illustration */}
          <LogInLogoIllustration />
          {/* Right: Login content */}
          <div className="flex flex-col items-center gap-4 xl:ml-10">
            {/* Heading */}
            <h1 className="text-3xl font-extrabold leading-[1.05] space-y-2 tracking-tight sm:text-3xl md:text-4xl">
              <span className="block uppercase text-[#6935C6]">
                Welcome Back
              </span>
              <span className="text-white text-base font-light text-center block">
                Login to continue chatting with your friends
              </span>
            </h1>
            {/* Log In Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-md flex flex-col items-center gap-5"
            >
              {/* Email Field */}
              <Field label="Email" icon={Mail} error={errors.email?.message}>
                <input
                  type="email"
                  className={`${errors.email && errorInputStyle} ${inputStyle}`}
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required*" })}
                />
                {errors.email && (
                  <p className={errorStyle}>{errors.email.message}</p>
                )}
              </Field>
              {/* Password Field */}
              <Field
                label="Password"
                icon={Lock}
                error={errors.password?.message}
              >
                <input
                  type={`${showPwd ? "text" : "password"}`}
                  className={`${errors.password && errorInputStyle} ${inputStyle} `}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required*",
                  })}
                />
                {errors.password && (
                  <p className={errorStyle}>{errors.password.message}</p>
                )}
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
              {/* Log in button */}
              <button
                type="submit"
                className="bg-[#6935C6] cursor-pointer font-bold w-full text-white p-3 rounded-md"
              >
                <span
                  className={`${isLoading ? "animate-ping" : ""} transition `}
                >
                  {isLoading ? "Redirecting..." : "Login"}
                </span>
              </button>
              {/* Don't have an account. Create new account option*/}
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-center">
                  Don't have an account?{" "}
                  <Link
                    href="/signup-page"
                    className="text-violet-400 hover:underline "
                  >
                    Sign up
                  </Link>
                </p>
                <p className="text-violet-400 cursor-pointer text-sm">
                  Forgot password?
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
