"use client"

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  UserCog, 
  Settings, 
  LogOut, 
  Home,
  Mail,
  Calendar,
  User
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

interface UserData {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoaded && user) {
        try {
          // First, sync user to Firestore
          await fetch('/api/sync-user', { method: 'POST' });
          
          // Then fetch user data
          const userDoc = await getDoc(doc(db, "users", user.id));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else if (isLoaded && !user) {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isLoaded]);

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
      label: "Profile",
      href: "/profile",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/landing");
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full min-h-screen overflow-hidden transition-all duration-300">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {open && <span>Logout</span>}
              </button>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
              <div className="flex items-center gap-6">
                {userData?.imageUrl && (
                  <img
                    src={userData.imageUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {userData?.firstName} {userData?.lastName}
                  </h1>
                  <p className="text-purple-100">@{userData?.username || 'user'}</p>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6">
                Profile Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">First Name</span>
                  </div>
                  <p className="text-lg text-neutral-800 dark:text-neutral-200 pl-7">
                    {userData?.firstName || 'N/A'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">Last Name</span>
                  </div>
                  <p className="text-lg text-neutral-800 dark:text-neutral-200 pl-7">
                    {userData?.lastName || 'N/A'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Mail className="w-5 h-5" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-lg text-neutral-800 dark:text-neutral-200 pl-7">
                    {userData?.email || 'N/A'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">Username</span>
                  </div>
                  <p className="text-lg text-neutral-800 dark:text-neutral-200 pl-7">
                    {userData?.username || 'N/A'}
                  </p>
                </div>

                {userData?.createdAt && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm font-medium">Member Since</span>
                    </div>
                    <p className="text-lg text-neutral-800 dark:text-neutral-200 pl-7">
                      {new Date(userData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">Last Updated</span>
                  </div>
                  <p className="text-lg text-neutral-800 dark:text-neutral-200 pl-7">
                    {userData?.updatedAt ? new Date(userData.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex gap-4">
                  <Button 
                    onClick={() => router.push('/homepage')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Back to Dashboard
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    className="border-neutral-300 dark:border-neutral-600"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
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
