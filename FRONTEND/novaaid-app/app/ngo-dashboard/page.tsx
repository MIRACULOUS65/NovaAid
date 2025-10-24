"use client"

import React from "react";
import { motion } from "framer-motion";
import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NGODashboard() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#000] to-[#1A2428] text-white flex flex-col items-center justify-center p-8 relative">
      {/* Back Button */}
      <Link 
        href="/role-select"
        className="absolute top-8 left-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Role Selection</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center space-y-8"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-50" />
            <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-full">
              <Building2 className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
          NGO Dashboard
        </h1>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-xl md:text-2xl text-neutral-200">
            Coming Soon
          </p>
          <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto">
            The NGO dashboard is currently under development. This section will allow NGOs to manage aid distribution, track resources, and coordinate relief efforts.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <FeatureCard
            title="Resource Management"
            description="Track and allocate aid resources efficiently"
          />
          <FeatureCard
            title="Distribution Tracking"
            description="Monitor aid distribution in real-time"
          />
          <FeatureCard
            title="Analytics & Reports"
            description="Generate insights from aid operations"
          />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600/20 border border-purple-600/50 rounded-full">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span className="text-purple-300 text-sm font-medium">In Development</span>
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </motion.div>
  );
}
