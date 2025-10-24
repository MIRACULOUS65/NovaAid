"use client"

import { useEffect } from "react";
import LoadingAnimation from "@/components/ui/loading-animation";

export default function RootPage() {
  useEffect(() => {
    // Show loading animation for 3 seconds then redirect
    const timer = setTimeout(() => {
      window.location.href = "/landing";
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return <LoadingAnimation />;
}
