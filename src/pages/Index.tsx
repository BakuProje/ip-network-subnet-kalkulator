import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Cable, Server, Binary, Zap } from "lucide-react";
import { calculateIP, generateSubnettingTable, binaryToDecimal, decimalToBinary, isValidIP } from "@/lib/subnet";
import type { IPInfo } from "@/lib/subnet";
import NetworkCards from "@/components/NetworkCards";
import BinaryVisual from "@/components/BinaryVisual";
import SubnettingTable from "@/components/SubnettingTable";
import BinaryConverter from "@/components/BinaryConverter";
import CIDRReferenceTable from "@/components/CIDRReferenceTable";
import IPClassRanges from "@/components/IPClassRanges";
import PrivatePublicChecker from "@/components/PrivatePublicChecker";
import IPToBinaryConverter from "@/components/IPToBinaryConverter";
import SubnetCalculator from "@/components/SubnetCalculator";
import NetworkPlanningTool from "@/components/NetworkPlanningTool";
import logo from "@/galery/LOGO KZ.png";

const Index = () => {
  const [ipInput, setIpInput] = useState("");
  const ipInfo = useMemo(() => calculateIP(ipInput), [ipInput]);

  return (
    <div className="min-h-screen bg-background binary-watermark grid-pattern relative overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/95 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <img 
                  src={logo} 
                  alt="KZ Logo" 
                  className="relative w-12 h-12 rounded-full object-cover border-2 border-primary/50 shadow-lg"
                />
              </motion.div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  IP SUBNET CALCULATOR
                </h1>
              </div>
            </div>

            {/* Tech Icons */}
            <div className="hidden md:flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
              >
                <Cpu className="w-5 h-5 text-secondary" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
              >
                <Cable className="w-5 h-5 text-accent" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Server className="w-5 h-5 text-primary" />
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30 rounded-xl blur-sm group-focus-within:blur-md transition-all" />
            <div className="relative bg-card rounded-xl p-6 border border-border">
              <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Binary className="w-4 h-4 text-primary" />
                Masukkan Alamat IP
              </label>
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="Contoh: 192.168.1.1"
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 font-mono text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              {ipInput && !ipInfo && (
                <p className="mt-2 text-sm text-destructive font-mono">
                  ⚠ Format IP tidak valid
                </p>
              )}
              {ipInfo && (
                <p className="mt-2 text-sm text-secondary font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3" /> IP terdeteksi — Kelas {ipInfo.ipClass}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {ipInfo && (
            <motion.div
              key={ipInfo.ip + ipInfo.ipClass}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* NetworkCards */}
              <div className="mb-8">
                <NetworkCards info={ipInfo} />
              </div>

              {/* CIDR Reference Table */}
              <div className="mb-8">
                <CIDRReferenceTable ipClass={ipInfo.ipClass} />
              </div>

              {/* Subnetting Table */}
              <div className="mb-8">
                <SubnettingTable info={ipInfo} />
              </div>

              {/* Binary Visual */}
              <div>
                <BinaryVisual info={ipInfo} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Binary/Decimal Converter — always visible */}
        <div className="mt-10">
          <BinaryConverter />
        </div>

        {/* Tools Section */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Tools Tambahan
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PrivatePublicChecker />
            <IPToBinaryConverter />
            <SubnetCalculator />
            <NetworkPlanningTool />
          </div>
        </div>

        {/* IP Class Ranges — always visible */}
        <div className="mt-10">
          <IPClassRanges />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-8">
            {/* Logo & Title */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300" />
                <img 
                  src={logo} 
                  alt="KZ Logo" 
                  className="relative w-16 h-16 rounded-full object-cover border-2 border-primary/40 shadow-xl"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                 IP SUBNET CALCULATOR
                </h3>
                <p className="text-sm text-muted-foreground mt-1">by Kuzuroken</p>
              </div>
            </motion.div>

            {/* Social Media Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <motion.a
                href="https://www.tiktok.com/@kuzuroken"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-cyan-500/10 hover:from-pink-500/20 hover:to-cyan-500/20 border border-pink-500/30 hover:border-pink-500/50 transition-all shadow-lg hover:shadow-pink-500/20 group"
              >
                <svg 
                  className="w-6 h-6 fill-current text-foreground group-hover:text-pink-500 transition-colors" 
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span className="font-medium">TikTok</span>
              </motion.a>

              <motion.a
                href="https://www.instagram.com/kuzuroken.20/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-all shadow-lg hover:shadow-purple-500/20 group"
              >
                <svg 
                  className="w-6 h-6 fill-current text-foreground group-hover:text-pink-500 transition-colors" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="font-medium">Instagram</span>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
