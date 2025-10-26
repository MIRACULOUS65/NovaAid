"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function TestAuthPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading auth state...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6">Auth Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Is Loaded:</span>{" "}
            <span className={isLoaded ? "text-green-600" : "text-red-600"}>
              {isLoaded ? "✅ Yes" : "❌ No"}
            </span>
          </div>
          
          <div>
            <span className="font-semibold">Is Signed In:</span>{" "}
            <span className={isSignedIn ? "text-green-600" : "text-red-600"}>
              {isSignedIn ? "✅ Yes" : "❌ No"}
            </span>
          </div>
          
          {isSignedIn && user && (
            <>
              <div>
                <span className="font-semibold">User ID:</span> {user.id}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {user.primaryEmailAddress?.emailAddress || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Username:</span> {user.username || "N/A"}
              </div>
            </>
          )}
          
          <div className="pt-4 space-x-4">
            <button
              onClick={() => router.push("/sign-in")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Sign In
            </button>
            <button
              onClick={() => router.push("/ngo-portal")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Portal
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
