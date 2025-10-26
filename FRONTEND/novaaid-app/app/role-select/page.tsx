"use client"

import React, { useState } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Building2 } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";

export default function RoleSelectPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleSelect = async (role: 'user' | 'ngo') => {
    setLoading(role);

    try {
      // If user is signed in, set their role
      if (isLoaded && user) {
        // Check if user is trying to switch from a different role
        const currentRole = user.publicMetadata?.activeRole as string | undefined;
        
        if (currentRole && currentRole !== role) {
          // User is trying to switch roles - sign them out first
          const confirmSwitch = confirm(
            `You are currently signed in as ${currentRole.toUpperCase()}. To access the ${role.toUpperCase()} portal, you need to sign out first. Continue?`
          );
          
          if (confirmSwitch) {
            await signOut();
            // After sign out, redirect to the appropriate portal
            if (role === 'ngo') {
              const ngoPortalUrl = process.env.NEXT_PUBLIC_NGO_PORTAL_URL || 'http://localhost:3002';
              window.location.href = ngoPortalUrl;
            } else {
              window.location.href = '/sign-in?redirect_url=/homepage';
            }
          } else {
            setLoading(null);
          }
          return;
        }
        
        // Set the active role
        await fetch('/api/auth/set-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
        });
      }
      
      // Navigate to appropriate portal
      if (role === 'user') {
        router.push('/homepage');
      } else {
        const ngoPortalUrl = process.env.NEXT_PUBLIC_NGO_PORTAL_URL || 'http://localhost:3002';
        window.location.href = ngoPortalUrl;
      }
    } catch (error) {
      console.error('Error selecting role:', error);
      // Continue with navigation even if role setting fails
      if (role === 'user') {
        router.push('/homepage');
      } else {
        const ngoPortalUrl = process.env.NEXT_PUBLIC_NGO_PORTAL_URL || 'http://localhost:3002';
        window.location.href = ngoPortalUrl;
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="h-screen w-full relative bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Sparkles Background */}
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesroleselect"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Choose Your Role
          </h1>
          <p className="text-neutral-300 text-lg md:text-xl">
            Select how you want to access NovaAid
          </p>
        </motion.div>

        {/* Role Selection Buttons */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          {/* USER Button */}
          <RoleButton
            role="user"
            title="USER"
            description="Access aid and support services"
            icon={<Users className="w-16 h-16" />}
            onClick={() => handleRoleSelect('user')}
            delay={0.2}
            loading={loading === 'user'}
          />

          {/* NGO Button */}
          <RoleButton
            role="ngo"
            title="NGO"
            description="Manage and provide aid services"
            icon={<Building2 className="w-16 h-16" />}
            onClick={() => handleRoleSelect('ngo')}
            delay={0.4}
            loading={loading === 'ngo'}
          />
        </div>
      </div>
    </div>
  );
}

interface RoleButtonProps {
  role: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  delay: number;
  loading?: boolean;
}

function RoleButton({ role, title, description, icon, onClick, delay, loading = false }: RoleButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      onClick={onClick}
      className="relative cursor-pointer"
      id="poda"
    >
      <div className="relative flex items-center justify-center">
        {/* Animated Border Layers - Exact from button-design.jsx */}
        <div className="glow" />
        <div className="darkBorderBg" />
        <div className="darkBorderBg" />
        <div className="darkBorderBg" />
        <div className="white" />
        <div className="border" />
        
        {/* Main Button Content */}
        <div className="main relative bg-[#010201] rounded-xl w-[320px] h-[400px] flex flex-col items-center justify-center gap-6 z-10">
          {/* Icon Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50" />
            <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-full text-white">
              {loading ? (
                <div className="w-16 h-16 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : (
                icon
              )}
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-3 px-6">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              {title}
            </h2>
            <p className="text-neutral-400 text-base">
              {description}
            </p>
          </div>

          {/* Hover Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
              <span>Click to continue</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .white,
        .border,
        .darkBorderBg,
        .glow {
          max-height: 400px;
          max-width: 320px;
          height: 100%;
          width: 100%;
          position: absolute;
          overflow: hidden;
          z-index: -1;
          border-radius: 12px;
          filter: blur(3px);
        }

        .white {
          max-height: 394px;
          max-width: 314px;
          border-radius: 10px;
          filter: blur(2px);
        }

        .white::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(83deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: brightness(1.4);
          background-image: conic-gradient(
            rgba(0, 0, 0, 0) 0%,
            #a099d8,
            rgba(0, 0, 0, 0) 8%,
            rgba(0, 0, 0, 0) 50%,
            #dfa2da,
            rgba(0, 0, 0, 0) 58%
          );
          transition: all 2s;
        }

        .border {
          max-height: 396px;
          max-width: 316px;
          border-radius: 11px;
          filter: blur(0.5px);
        }

        .border::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(70deg);
          position: absolute;
          width: 600px;
          height: 600px;
          filter: brightness(1.3);
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #1c191c,
            #402fb5 5%,
            #1c191c 14%,
            #1c191c 50%,
            #cf30aa 60%,
            #1c191c 64%
          );
          transition: all 2s;
        }

        .darkBorderBg {
          max-height: 404px;
          max-width: 324px;
        }

        .darkBorderBg::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(82deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            rgba(0, 0, 0, 0),
            #18116a,
            rgba(0, 0, 0, 0) 10%,
            rgba(0, 0, 0, 0) 50%,
            #6e1b60,
            rgba(0, 0, 0, 0) 60%
          );
          transition: all 2s;
        }

        #poda:hover > .darkBorderBg::before {
          transform: translate(-50%, -50%) rotate(262deg);
        }

        #poda:hover > .glow::before {
          transform: translate(-50%, -50%) rotate(240deg);
        }

        #poda:hover > .white::before {
          transform: translate(-50%, -50%) rotate(263deg);
        }

        #poda:hover > .border::before {
          transform: translate(-50%, -50%) rotate(250deg);
        }

        .glow {
          overflow: hidden;
          filter: blur(30px);
          opacity: 0.4;
          max-height: 420px;
          max-width: 340px;
        }

        .glow:before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(60deg);
          position: absolute;
          width: 999px;
          height: 999px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #000,
            #402fb5 5%,
            #000 38%,
            #000 50%,
            #cf30aa 60%,
            #000 87%
          );
          transition: all 2s;
        }

        .main {
          position: relative;
        }
      `}</style>
    </motion.div>
  );
}
