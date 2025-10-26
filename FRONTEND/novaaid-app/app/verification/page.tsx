"use client"

import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  UserCog, 
  Settings, 
  LogOut, 
  Home,
  Shield,
  Wallet,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/nextjs";
import { 
  switchToCeloNetwork, 
  getVerifiedPaymentsContract, 
  getCUSDContract 
} from "@/lib/celo/contracts";
import { getOrCreateIdentity } from "@/lib/semaphore/identity";

export default function VerificationPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  // Wallet state
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationFee, setVerificationFee] = useState<string>("0.01");
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  // Check verification status on load
  useEffect(() => {
    if (user) {
      checkVerificationStatus();
    }
  }, [user]);

  const checkVerificationStatus = async () => {
    try {
      const response = await fetch('/api/verification/status');
      
      if (response.ok) {
        const data = await response.json();
        setIsVerified(data.verified);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError("");
    
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed. Please install MetaMask to continue.");
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setWalletAddress(accounts[0]);
      
      // Switch to Celo Sepolia
      await switchToCeloNetwork('sepolia');
      
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleVerification = async () => {
    if (!walletAddress) {
      setError("Please connect your wallet first");
      return;
    }

    setIsVerifying(true);
    setError("");
    
    try {
      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Get contract
      const paymentsContract = getVerifiedPaymentsContract(signer, 'sepolia');
      
      // Get verification fee from contract
      const fee = await paymentsContract.verificationFee();
      console.log("Verification fee:", ethers.formatEther(fee), "CELO");
      
      // Check CELO balance
      const balance = await provider.getBalance(walletAddress);
      console.log("Your CELO balance:", ethers.formatEther(balance), "CELO");
      console.log("Required fee:", ethers.formatEther(fee), "CELO");
      
      if (balance < fee) {
        throw new Error(`Insufficient CELO balance. You have ${ethers.formatEther(balance)} CELO but need ${ethers.formatEther(fee)} CELO. Please get test CELO from https://faucet.celo.org/alfajores`);
      }
      
      // Generate or get Semaphore identity
      const { commitment, isNew } = getOrCreateIdentity(user!.id);
      
      // Register commitment if new
      if (isNew) {
        console.log("Registering commitment...");
        const commitmentResponse = await fetch('/api/commitment/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            commitment
          })
        });
        
        if (!commitmentResponse.ok) {
          const errorData = await commitmentResponse.json();
          console.error("Commitment registration error:", errorData);
          throw new Error(errorData.error || "Failed to register commitment");
        }
      }
      
      // Pay verification fee with native CELO
      console.log("Paying verification fee with CELO...");
      console.log("Fee amount (wei):", fee.toString());
      console.log("Fee amount (CELO):", ethers.formatEther(fee));
      console.log("Sending transaction to contract...");
      
      // This will trigger MetaMask popup
      const paymentTx = await paymentsContract.payVerificationFee({ value: fee });
      console.log("Transaction sent! Hash:", paymentTx.hash);
      console.log("Waiting for confirmation...");
      
      const receipt = await paymentTx.wait();
      console.log("Payment confirmed! Block:", receipt.blockNumber);
      console.log("Transaction receipt:", receipt);
      setTxHash(paymentTx.hash);
      
      // Record verification through Next.js API route
      const verificationResponse = await fetch('/api/verification/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          txHash: paymentTx.hash,
          amount: ethers.formatEther(fee),
          walletAddress
        })
      });
      
      if (!verificationResponse.ok) {
        console.error("Failed to record verification");
        throw new Error("Failed to record verification in database");
      }
      
      const verificationData = await verificationResponse.json();
      console.log("Verification recorded:", verificationData);
      
      setIsVerified(true);
      
      // Redirect to profile page after 2 seconds
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Verification failed");
      console.error("Verification error:", err);
    } finally {
      setIsVerifying(false);
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
      icon: <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Dashboard",
      href: "/homepage",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Verification",
      href: "/verification",
      icon: <Shield className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    }
  ];

  if (!isLoaded) {
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
    <div className="flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full min-h-screen overflow-hidden">
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
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
              <div className="flex items-center gap-4">
                <Shield className="w-12 h-12" />
                <div>
                  <h1 className="text-3xl font-bold">Account Verification</h1>
                  <p className="text-purple-100 mt-1">Verify your identity on the Celo blockchain</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {isVerified ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                    You're Verified!
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Your account has been successfully verified on the blockchain.
                  </p>
                  {txHash && (
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
                      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                        Transaction ID
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <code className="flex-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-700 px-4 py-3 rounded border border-neutral-200 dark:border-neutral-600 overflow-x-auto">
                          {txHash}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(txHash);
                            alert('Transaction ID copied!');
                          }}
                          className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex-shrink-0 text-sm font-medium"
                        >
                          Copy
                        </button>
                      </div>
                      <a
                        href={`https://alfajores.celoscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all font-medium"
                      >
                        <span>View on Celo Block Explorer</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                  <div className="mt-6">
                    <Button 
                      onClick={() => router.push('/profile')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Go to Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Why verify your account?
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Get a verified badge on your profile</li>
                      <li>• Increase trust with other users</li>
                      <li>• Access premium features</li>
                      <li>• Blockchain-verified identity</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <span className="text-neutral-700 dark:text-neutral-300">Verification Fee</span>
                      <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {verificationFee} CELO
                      </span>
                    </div>

                    {!walletAddress ? (
                      <Button
                        onClick={connectWallet}
                        disabled={isConnecting}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg"
                      >
                        <Wallet className="w-5 h-5 mr-2" />
                        {isConnecting ? "Connecting..." : "Connect MetaMask Wallet"}
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Wallet Connected</span>
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1 font-mono">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                          </p>
                        </div>

                        <Button
                          onClick={handleVerification}
                          disabled={isVerifying}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg"
                        >
                          <Shield className="w-5 h-5 mr-2" />
                          {isVerifying ? "Processing..." : "Pay & Verify"}
                        </Button>
                      </div>
                    )}

                    {error && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                          <AlertCircle className="w-5 h-5" />
                          <span className="font-medium">Error</span>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                      How it works:
                    </h3>
                    <ol className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                      <li>1. Connect your MetaMask wallet</li>
                      <li>2. Switch to Celo Alfajores testnet</li>
                      <li>3. Pay the verification fee (0.01 CELO)</li>
                      <li>4. Get your verified badge instantly</li>
                    </ol>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-4">
                      Need test CELO? Get it from the{" "}
                      <a 
                        href="https://faucet.celo.org/alfajores" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 underline"
                      >
                        Celo Faucet
                      </a>
                    </p>
                  </div>
                </>
              )}
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
