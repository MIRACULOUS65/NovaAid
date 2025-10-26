"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function RoleGuard({ children, requiredRole }: { children: React.ReactNode; requiredRole: "user" | "ngo" }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!isLoaded) return;

      if (!user) {
        // User not signed in - redirect to sign in
        router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      const currentRole = user.publicMetadata?.activeRole as string | undefined;

      if (!currentRole) {
        // No role set - set it now
        try {
          await fetch("/api/auth/set-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: requiredRole }),
          });
        } catch (error) {
          console.error("Error setting role:", error);
        }
        setIsChecking(false);
        return;
      }

      if (currentRole !== requiredRole) {
        // Wrong role - sign out and redirect
        alert(
          `You are signed in as ${currentRole.toUpperCase()}. To access the ${requiredRole.toUpperCase()} portal, you need to sign out first.`
        );
        await signOut();
        
        if (requiredRole === "user") {
          window.location.href = process.env.NEXT_PUBLIC_MAIN_APP_URL || "http://localhost:3000/role-select";
        } else {
          router.push("/sign-in");
        }
        return;
      }

      // Correct role - allow access
      setIsChecking(false);
    };

    checkRole();
  }, [user, isLoaded, requiredRole, signOut, router]);

  if (!isLoaded || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
