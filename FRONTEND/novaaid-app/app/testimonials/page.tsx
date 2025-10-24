"use client";

import React from "react";
import { motion } from "framer-motion";
import { SparklesCore } from "@/components/ui/sparkles";
import { ArrowLeft, Quote } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    text: "NovaAid transformed how we access emergency support. The platform's transparency and quick response saved our family during a critical time.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Johnson",
    role: "Refugee Family",
  },
  {
    text: "As an NGO coordinator, NovaAid's blockchain-based tracking gives us unprecedented visibility into aid distribution. It's revolutionary.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Ahmed Hassan",
    role: "NGO Coordinator",
  },
  {
    text: "The AI-powered resource matching connected us with exactly what we needed. No more bureaucracy, just efficient, compassionate aid.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Maria Garcia",
    role: "Aid Recipient",
  },
  {
    text: "NovaAid's transparency restored my faith in humanitarian systems. Every donation is tracked, every resource accounted for.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "David Chen",
    role: "Donor",
  },
  {
    text: "The 24/7 support and multilingual assistance made navigating the aid process so much easier for our community.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Fatima Al-Rashid",
    role: "Community Leader",
  },
  {
    text: "Implementing NovaAid streamlined our operations significantly. The analytics dashboard helps us make data-driven decisions.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Lisa Anderson",
    role: "Operations Manager",
  },
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105"
    >
      <Quote className="w-10 h-10 text-purple-400 mb-4" />
      <p className="text-gray-300 text-base mb-6 leading-relaxed">{testimonial.text}</p>
      <div className="flex items-center gap-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full border-2 border-purple-400"
        />
        <div>
          <div className="font-semibold text-white">{testimonial.name}</div>
          <div className="text-sm text-gray-400">{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen w-full relative bg-black overflow-hidden">
      {/* Sparkles Background */}
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlestestimonials"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={1}
        />
      </div>

      {/* Back Button */}
      <Link
        href="/homepage"
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Homepage</span>
      </Link>

      {/* Content */}
      <div className="relative z-10 pt-32 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10 mb-6">
            <span className="text-purple-400 font-semibold">Testimonials</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6">
            What our users say
          </h1>
          
          <p className="text-gray-300 text-lg">
            Real stories from people who have experienced the power of NovaAid
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to make a difference?
          </h3>
          <p className="text-gray-400 mb-8">
            Join thousands of users who trust NovaAid for transparent, efficient aid distribution
          </p>
          <Link
            href="/role-select"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-800/50"
          >
            Get Started Today
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
