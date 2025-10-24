"use client"

import { ShaderAnimation } from "@/components/ui/shader-animation";
import { GradientButton } from "@/components/ui/gradient-button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <ShaderAnimation />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <span className="pointer-events-none text-center text-5xl md:text-7xl leading-none font-semibold tracking-tighter whitespace-pre-wrap text-white mb-4">
          NovaAid
        </span>
        
        <div className="text-center space-y-3 mb-8 max-w-3xl">
          <p className="text-lg md:text-2xl text-neutral-200 font-light italic">
            &ldquo;Illuminating Trust in Every Crisis.&rdquo;
          </p>
          <p className="text-sm md:text-base text-neutral-300">
            🌍 Symbolizes resilience and transparency — AI & blockchain uniting to restore faith in global aid systems.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/homepage" prefetch={true}>
            <GradientButton>
              Get Started
            </GradientButton>
          </Link>
          <Link href="#about" prefetch={true}>
            <GradientButton variant="variant">
              About Us
            </GradientButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
