import Image from "next/image";
import React from "react";
import messagePuppetIcon from "@/assets/logo/messagePuppetIcon.png";

export default function LogInLogoIllustration() {
  return (
    <div className="relative flex items-center justify-center py-10 lg:py-0">
      {/* Orbit ring */}
      <div className="absolute h-[260px] w-[420px] rotate-[-18deg] rounded-full border border-violet-500/30 sm:h-[320px] sm:w-[520px] md:h-[380px] md:w-[620px]" />

      {/* Floor glow ellipse */}
      <div className="absolute bottom-[-40px] h-10 w-72 rounded-full bg-violet-600/40 blur-2xl sm:w-96" />

      {/* Chat bubble icon */}
      <Image
        src={messagePuppetIcon}
        alt="message"
        className="drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]"
      />
    </div>
  );
}
