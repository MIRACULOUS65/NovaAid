"use client"

import React, { useState, useEffect } from "react"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { 
  LayoutDashboard, 
  HandHeart, 
  FileText, 
  Settings, 
  UserCircle,
  LogOut,
  Building2,
  Video,
  ShieldAlert
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { RoleGuard } from "@/components/RoleGuard"

export default function NGOPortalPage() {
  return (
    <RoleGuard requiredRole="ngo">
      <NGOPortalContent />
    </RoleGuard>
  );
}

function NGOPortalContent() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [ngoData, setNgoData] = useState<any>({
    ngoName: user?.firstName || "NGO",
    initialized: false
  });

  useEffect(() => {
    if (isLoaded && user) {
      // Set default NGO data from user
      setNgoData({
        ngoName: user.firstName || user.username || "NGO Organization",
        email: user.emailAddresses[0]?.emailAddress,
        initialized: true
      });
      
      // Fetch full NGO data in background (optional)
      fetchNGOData();
    }
  }, [isLoaded, user]);

  const fetchNGOData = async () => {
    try {
      const response = await fetch("/api/ngo/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setNgoData(data.ngo);
        }
      }
    } catch (error) {
      console.error("Error fetching NGO data:", error);
      // Continue with default data instead of failing
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const links = [
    {
      label: "Dashboard",
      href: "/ngo-portal",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Aid Programs",
      href: "/ngo-portal/location-tracker",
      icon: (
        <HandHeart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Reports",
      href: "/ngo-portal/reports",
      icon: (
        <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
      label: "Fraud Detection",
      href: "/ngo-portal/fraud-detection",
      icon: (
        <ShieldAlert className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/ngo-portal/settings",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/ngo-portal/profile",
      icon: (
        <UserCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ]

  const [open, setOpen] = useState(false)

  if (!isLoaded || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Loading NGO Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo ngoName={ngoData?.ngoName} /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-start gap-2 group/sidebar py-2 w-full text-left"
            >
              <LogOut className="text-red-600 dark:text-red-400 h-5 w-5 flex-shrink-0" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-red-600 dark:text-red-400 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
              >
                Logout
              </motion.span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 overflow-auto">
        <BackgroundPaths title="NGO Excellence Portal" />
      </div>
    </div>
  )
}

const Logo = ({ ngoName }: { ngoName?: string }) => {
  return (
    <Link
      href="/ngo-portal"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Building2 className="h-6 w-6 text-neutral-800 dark:text-white flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold text-black dark:text-white whitespace-pre"
      >
        {ngoName || "NovaAid NGO"}
      </motion.span>
    </Link>
  )
}

const LogoIcon = () => {
  return (
    <Link
      href="/ngo-portal"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Building2 className="h-6 w-6 text-neutral-800 dark:text-white flex-shrink-0" />
    </Link>
  )
}
