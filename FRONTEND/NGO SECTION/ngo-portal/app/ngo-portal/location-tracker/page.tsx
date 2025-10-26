"use client"

import React, { useState } from "react"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
import { 
  LayoutDashboard, 
  HandHeart, 
  FileText, 
  Settings, 
  UserCircle,
  LogOut,
  Building2,
  Video,
  ShieldAlert,
  ExternalLink,
  AlertCircle,
  MapPin
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { RoleGuard } from "@/components/RoleGuard"

export default function LocationTrackerPage() {
  return (
    <RoleGuard requiredRole="ngo">
      <LocationTrackerContent />
    </RoleGuard>
  );
}

function LocationTrackerContent() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
  ];

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
            {open ? <Logo /> : <LogoIcon />}
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-neutral-900">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <MapPin className="w-10 h-10 text-green-600" />
              Location Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time refugee location tracking and safety zone monitoring
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  Location Tracker Running on Port 3005
                </h3>
                <p className="text-green-800 dark:text-green-300 mb-4">
                  The location tracking system allows real-time monitoring of refugee movements within designated safe zones. 
                  Access it through the embedded interface below or open it in a new window.
                </p>
                <a
                  href="http://localhost:3005"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Window
                </a>
              </div>
            </div>
          </div>

          {/* Embedded Location Tracker */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Tracking Interface
              </h2>
            </div>
            <div className="relative" style={{ height: 'calc(100vh - 400px)', minHeight: '600px' }}>
              <iframe
                src="http://localhost:3005"
                className="w-full h-full border-0"
                title="Location Tracker System"
              />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📍 Real-Time Tracking</h3>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Monitor refugee locations in real-time with GPS tracking.
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🎯 Hotspot Zones</h3>
              <p className="text-sm text-purple-800 dark:text-purple-300">
                Define and monitor safe zones with automatic alerts.
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">⚠️ Boundary Alerts</h3>
              <p className="text-sm text-orange-800 dark:text-orange-300">
                Get instant notifications when users leave safe zones.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">🗺️ Interactive Map</h3>
              <p className="text-sm text-green-800 dark:text-green-300">
                Leaflet-powered maps with custom markers and zones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Logo = () => {
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
        NovaAid NGO
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="/ngo-portal"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Building2 className="h-6 w-6 text-neutral-800 dark:text-white flex-shrink-0" />
    </Link>
  );
};
