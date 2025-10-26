"use client"

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Scene } from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  UserCog, 
  Settings, 
  LogOut, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Zap,
  Home,
  DollarSign,
  MessageSquare,
  Video
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/RoleGuard";

const features = [
  {
    icon: Cpu,
    title: "Emergency Support",
    description: "24/7 assistance for refugees in critical situations.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description: "Your data is protected with advanced encryption.",
  },
  {
    icon: Layers,
    title: "Resource Hub",
    description: "Access to essential services and information.",
  },
  {
    icon: Zap,
    title: "Quick Response",
    description: "Rapid deployment of aid and resources.",
  },
];

export default function Homepage() {
  return (
    <RoleGuard requiredRole="user">
      <HomepageContent />
    </RoleGuard>
  );
}

function HomepageContent() {
  const { user, isSignedIn } = useUser();
  const { signOut, openSignIn } = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleProfileClick = () => {
    if (isSignedIn) {
      router.push("/profile");
    } else {
      openSignIn();
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/landing");
  };

  const links = [
    {
      label: "Home",
      href: "/landing",
      icon: (
        <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Dashboard",
      href: "/homepage",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Pricing",
      href: "/pricing",
      icon: (
        <DollarSign className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Testimonials",
      href: "/testimonials",
      icon: (
        <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Video Room",
      href: "/video/room/test-room-123",
      icon: (
        <Video className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-screen overflow-hidden transition-all duration-300">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              {/* Profile Button */}
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
              >
                <UserCog className="h-5 w-5 flex-shrink-0" />
                {open && <span>Profile</span>}
              </button>
              {/* Logout Button - Only visible when signed in */}
              {isSignedIn && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  {open && <span>Logout</span>}
                </button>
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <MainContent />
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      href="/homepage"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        NovaAid
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="/homepage"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

const MainContent = () => {
  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="min-h-screen w-full bg-gradient-to-br from-[#000] to-[#1A2428] text-white flex flex-col items-center justify-center p-8 relative">
        <div className="w-full max-w-6xl space-y-12 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge variant="secondary" className="backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 px-4 py-2 rounded-full">
              ✨ Refugee Aid Platform
            </Badge>
            
            <div className="space-y-6 flex items-center justify-center flex-col">
              <h1 className="text-4xl md:text-7xl font-bold tracking-tight max-w-4xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                NovaAid
              </h1>
              <p className="text-xl md:text-2xl text-neutral-200 max-w-3xl font-light italic">
                🌍 A New Dawn for Humanitarian Trust.
              </p>
              <p className="text-base md:text-lg text-neutral-300 max-w-2xl">
                Evokes rebirth and innovation — AI & blockchain lighting a new path for global aid.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
                <Button className="text-sm px-8 py-3 rounded-xl bg-white text-black border border-white/10 shadow-none hover:bg-white/90 transition-all duration-300 hover:scale-105">
                  Request Aid
                </Button>
                <Button className="text-sm px-8 py-3 rounded-xl bg-transparent text-white border border-white/20 shadow-none hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 h-40 md:h-48 flex flex-col justify-start items-start space-y-2 md:space-y-3 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:border-white/20"
              >
                <feature.icon size={18} className="text-white/80 md:w-5 md:h-5" />
                <h3 className="text-sm md:text-base font-medium">{feature.title}</h3>
                <p className="text-xs md:text-sm text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0">
          <Scene />
        </div>
      </div>
    </div>
  );
};
