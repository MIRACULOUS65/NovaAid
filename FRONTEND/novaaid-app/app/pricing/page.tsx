"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SparklesCore } from "@/components/ui/sparkles";
import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Basic",
    description: "Perfect for individuals and small families seeking essential aid services",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    includes: [
      "Free includes:",
      "Emergency Support Access",
      "Basic Resource Information",
      "Community Forum Access",
      "Email Support",
    ],
  },
  {
    name: "Standard",
    description: "Ideal for families and small groups needing comprehensive support",
    price: 29,
    yearlyPrice: 299,
    buttonText: "Get Started",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Everything in Basic, plus:",
      "Priority Emergency Response",
      "Advanced Resource Matching",
      "24/7 Chat Support",
      "Personalized Aid Plans",
      "Document Assistance",
    ],
  },
  {
    name: "Premium",
    description: "Complete solution for organizations and large groups requiring full access",
    price: 99,
    yearlyPrice: 999,
    buttonText: "Contact Us",
    buttonVariant: "outline" as const,
    includes: [
      "Everything in Standard, plus:",
      "Dedicated Support Manager",
      "Multi-location Coordination",
      "Advanced Analytics Dashboard",
      "Custom Integration Options",
      "Training & Onboarding",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-gray-700 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit h-10 rounded-full px-6 py-2 font-medium transition-colors ${
            selected === "0" ? "text-white" : "text-gray-400"
          }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId="switch"
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-purple-600 border-purple-600 bg-gradient-to-t from-purple-500 to-purple-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit h-10 rounded-full px-6 py-2 font-medium transition-colors ${
            selected === "1" ? "text-white" : "text-gray-400"
          }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId="switch"
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-purple-600 border-purple-600 bg-gradient-to-t from-purple-500 to-purple-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div className="min-h-screen w-full relative bg-black overflow-hidden">
      {/* Sparkles Background */}
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlespricing"
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
        <article className="text-center mb-12 max-w-3xl mx-auto space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
          >
            Plans that work best for you
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-300 text-lg"
          >
            Choose the perfect plan for your needs. All plans include our core features.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <PricingSwitch onSwitch={togglePricingPeriod} />
          </motion.div>
        </article>

        <div className="grid md:grid-cols-3 max-w-6xl gap-6 mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 * (index + 1) }}
            >
              <Card
                className={`relative text-white border-neutral-800 h-full ${
                  plan.popular
                    ? "bg-gradient-to-br from-purple-900/20 via-neutral-900 to-pink-900/20 shadow-[0px_0px_50px_0px_rgba(168,85,247,0.4)] scale-105 md:scale-110"
                    : "bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <CardHeader className="text-left">
                  <div className="flex justify-between items-start">
                    <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-bold">
                      ${isYearly ? plan.yearlyPrice : plan.price}
                    </span>
                    <span className="text-gray-400 ml-2">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <button
                    className={`w-full mb-6 p-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-800/50 text-white"
                        : "bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white"
                    }`}
                  >
                    {plan.buttonText}
                  </button>

                  <div className="space-y-3 pt-4 border-t border-neutral-700">
                    <h4 className="font-semibold text-base mb-4 text-purple-400">
                      {plan.includes[0]}
                    </h4>
                    <ul className="space-y-3">
                      {plan.includes.slice(1).map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <Check className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
