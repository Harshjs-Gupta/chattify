import React from "react";
import { Send, MessageCircle, ArrowDown } from "lucide-react";
import Link from "next/link";
import ScatteredDots from "@/components/ScatteredDots";
import AmbientBackground from "@/components/AmbientBackground";
import ChatBubbleIcon from "@/components/ChatBubbleIcon";

export default function LandingPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#06030f] text-white">
      {/* Ambient background glow */}
      <AmbientBackground right_left="right" top_bottom="top" />

      {/* Scattered dots */}
      <ScatteredDots right_left="left" top_bottom="top" />
      {/* <div className="pointer-events-none absolute inset-0 hidden sm:block">
        <span
          className={`absolute left-[60%] top-[20%] h-2 w-2 rounded-full bg-violet-400/70`}
        />
        <span
          className={`absolute left-[81%] top-[18%] h-2 w-2 rounded-full bg-violet-300/60`}
        />
        <span
          className={`absolute left-[91%] top-[17%] h-2.5 w-2.5 rounded-full bg-violet-400/80`}
        />
        <span
          className={`absolute left-[51%] top-[57%] h-1.5 w-1.5 rounded-full bg-violet-400/60`}
        />
        <span
          className={`absolute left-[95%] top-[55%] h-1.5 w-1.5 rounded-full bg-violet-300/50`}
        />
        <span
          className={`absolute left-[56%] top-[67%] h-1.5 w-1.5 rounded-full bg-violet-400/50`}
        />
        <span
          className={`absolute left-[88%] top-[68%] h-2 w-2 rounded-full bg-violet-300/70`}
        />
        <span
          className={`absolute left-[84%] top-[10%] h-1 w-1 rounded-full bg-violet-300/50`}
        />
      </div> */}

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 pb-16 pt-8 sm:px-10 lg:px-16">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <MessageCircle className="h-7 w-7 text-violet-400" strokeWidth={2} />
          <span className="text-xl font-bold tracking-tight">Chattify</span>
        </div>

        {/* Main content */}
        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-8">
          {/* Left: Text content */}
          <div className="flex flex-col items-start">
            <h1 className="text-6xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl md:text-7xl">
              <span className="block text-white">Connect.</span>
              <span className="block text-white">Chat.</span>
              <span className="block bg-linear-to-r from-[#6935C6] to-[#321B88] bg-clip-text text-transparent">
                Collab.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base text-slate-400 sm:text-lg">
              Chattify brings people closer with real-time conversations,
              seamless collaboration, and connections that matter.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login-page"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#6935C6] px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-500 active:bg-violet-500/50"
              >
                <Send className="h-4 w-4" />
                Start Chatting
              </Link>
              <Link
                href="/signup-page"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#6935C6] active:bg-violet-500/20 bg-transparent px-6 py-3.5 font-semibold text-white transition hover:bg-violet-500/10"
              >
                <MessageCircle className="h-4 w-4 text-[#6935C6]" />
                Sign in with Chattify
              </Link>
            </div>
          </div>

          {/* Right: Messenger Logo Illustration */}
          <div className="relative flex items-center justify-center py-10 lg:py-0">
            {/* Orbit ring */}
            <div className="absolute h-[260px] w-[420px] rotate-[-18deg] rounded-full border border-violet-500/30 sm:h-[320px] sm:w-[520px] md:h-[380px] md:w-[620px]" />

            {/* Floor glow ellipse */}
            <div className="absolute bottom-[-40px] h-10 w-72 rounded-full bg-violet-600/40 blur-2xl sm:w-96" />

            {/* Chat bubble icon */}
            <ChatBubbleIcon />
          </div>
        </div>
      </div>
    </main>
  );
}
