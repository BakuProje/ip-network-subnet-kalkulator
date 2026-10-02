import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  ChevronDown,
  Shield,
  ArrowRightLeft,
  Calculator,
  Users,
  Search,
  Monitor,
  RotateCcw,
} from "lucide-react";
import { calculateIP } from "@/lib/subnet";
import { convertIPToAllBases, IPAllBasesResult } from "@/lib/numberSystems";
import NetworkCards from "@/components/NetworkCards";
import SubnettingTable from "@/components/SubnettingTable";
import CIDRReferenceTable from "@/components/CIDRReferenceTable";
import BinaryVisual from "@/components/BinaryVisual";
import IPClassRanges from "@/components/IPClassRanges";

const ToolsTambahan = () => {
  const [isOpen, setIsOpen] = useState(false);

  // --- IP Subnet Calculator State ---
  const [ipInput, setIpInput] = useState("");
  const [submittedIP, setSubmittedIP] = useState("");

  const ipInfo = useMemo(() => {
    const val = submittedIP || ipInput;
    if (!val.trim()) return null;
    return calculateIP(val.trim());
  }, [submittedIP, ipInput]);

  const handleCalculateIP = () => {
    if (ipInput.trim()) {
      setSubmittedIP(ipInput.trim());
    }
  };

  const handleResetIP = () => {
    setIpInput("");
    setSubmittedIP("");
  };

  const handlePresetIP = (preset: string) => {
    setIpInput(preset);
    setSubmittedIP(preset);
  };

  // --- 1. State for Private vs Public Checker ---
  const [checkIpInput, setCheckIpInput] = useState("");
  const [checkResult, setCheckResult] = useState<{
    type: "private" | "public" | "special";
    range: string;
    description: string;
  } | null>(null);

  // --- 2. State for IP Format Converter ---
  const [formatIpInput, setFormatIpInput] = useState("192.168.1.1");
  const [formatResult, setFormatResult] = useState<IPAllBasesResult | null>(null);

  // --- 3. State for Subnet Division Calculator ---
  const [subnetNetwork, setSubnetNetwork] = useState("");
  const [subnetPrefix, setSubnetPrefix] = useState("24");
  const [subnetCount, setSubnetCount] = useState("2");
  const [subnetResult, setSubnetResult] = useState<{
    subnets: Array<{
      number: number;
      networkAddress: string;
      firstHost: string;
      lastHost: string;
      broadcastAddress: string;
    }>;
    subnetMask: string;
    totalSubnets: number;
  } | null>(null);

  // --- 4. State for Host Planning ---
  const [hostCount, setHostCount] = useState("");
  const [planResult, setPlanResult] = useState<{
    subnetMask: string;
    cidr: number;
    totalHosts: number;
    usableHosts: number;
    recommendation: string;
  } | null>(null);

  // Actions
  const handleCheckIP = () => {
    if (!checkIpInput.trim()) {
      setCheckResult(null);
      return;
    }
    const clean = checkIpInput.split("/")[0].trim();
    const parts = clean.split(".").map(Number);
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      setCheckResult(null);
      return;
    }
    const [a, b] = parts;
    if (a === 10) {
      setCheckResult({
        type: "private",
        range: "10.0.0.0 - 10.255.255.255",
        description: "Private Class A (Jaringan internal enterprise besar)",
      });
    } else if (a === 172 && b >= 16 && b <= 31) {
      setCheckResult({
        type: "private",
        range: "172.16.0.0 - 172.31.255.255",
        description: "Private Class B (Jaringan internal menengah)",
      });
    } else if (a === 192 && b === 168) {
      setCheckResult({
        type: "private",
        range: "192.168.0.0 - 192.168.255.255",
        description: "Private Class C (Jaringan internal rumah/LAN)",
      });
    } else if (a === 127) {
      setCheckResult({
        type: "special",
        range: "127.0.0.0 - 127.255.255.255",
        description: "Loopback Address (Localhost)",
      });
    } else {
      setCheckResult({
        type: "public",
        range: "Public IP Range (Internet Global)",
        description: "Alamat IP Publik yang dapat diakses melalui internet",
      });
    }
  };

  const handleConvertFormat = () => {
    if (!formatIpInput.trim()) {
      setFormatResult(null);
      return;
    }
    const res = convertIPToAllBases(formatIpInput);
    setFormatResult(res);
  };

  const handleCalculateSubnet = () => {
    if (!subnetNetwork.trim() || !subnetPrefix || !subnetCount) return;
    const parts = subnetNetwork.split(".").map(Number);
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return;

    const prefix = parseInt(subnetPrefix);
    const subnetsNeeded = parseInt(subnetCount);
    if (prefix < 0 || prefix > 30 || subnetsNeeded < 1) return;

    const maskBits = 32 - prefix;
    const subnetBits = Math.ceil(Math.log2(subnetsNeeded));
    const newPrefix = prefix - subnetBits;
    if (newPrefix < 0) return;

    const subnets = [];
    const increment = Math.pow(2, maskBits + subnetBits);

    for (let i = 0; i < subnetsNeeded; i++) {
      const baseIP = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
      const subnetIP = baseIP + i * increment;
      const a = (subnetIP >> 24) & 0xff;
      const b = (subnetIP >> 16) & 0xff;
      const c = (subnetIP >> 8) & 0xff;
      const d = subnetIP & 0xff;

      subnets.push({
        number: i + 1,
        networkAddress: `${a}.${b}.${c}.${d}`,
        firstHost: `${a}.${b}.${c}.${d + 1}`,
        broadcastAddress: `${a}.${b}.${c}.${d + increment - 1}`,
        lastHost: `${a}.${b}.${c}.${d + increment - 2}`,
      });
    }

    const maskValue = (0xffffffff << (32 - newPrefix)) >>> 0;
    const subnetMask = [
      (maskValue >> 24) & 0xff,
      (maskValue >> 16) & 0xff,
      (maskValue >> 8) & 0xff,
      maskValue & 0xff,
    ].join(".");

    setSubnetResult({
      subnets: subnets.slice(0, 8),
      subnetMask,
      totalSubnets: subnetsNeeded,
    });
  };

  const handlePlanHosts = () => {
    if (!hostCount.trim()) return;
    const hosts = parseInt(hostCount);
    if (isNaN(hosts) || hosts < 1) return;

    let hostBits = 0;
    let totalHosts = 1;
    while (totalHosts - 2 < hosts) {
      hostBits++;
      totalHosts = Math.pow(2, hostBits);
    }

    const cidr = 32 - hostBits;
    const usableHosts = totalHosts - 2;
    const maskValue = (0xffffffff << hostBits) >>> 0;
    const subnetMask = [
      (maskValue >> 24) & 0xff,
      (maskValue >> 16) & 0xff,
      (maskValue >> 8) & 0xff,
      maskValue & 0xff,
    ].join(".");

    let recommendation = "";
    if (cidr >= 24) {
      recommendation = "Gunakan Kelas C (Cocok untuk LAN / Kantor Kecil)";
    } else if (cidr >= 16) {
      recommendation = "Gunakan Kelas B (Cocok untuk Jaringan Menengah)";
    } else {
      recommendation = "Gunakan Kelas A (Cocok untuk Jaringan Enterprise / Kampus)";
    }

    setPlanResult({
      subnetMask,
      cidr,
      totalHosts,
      usableHosts,
      recommendation,
    });
  };

  return (
    <div className="neo-box bg-white overflow-hidden space-y-0">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-slate-50 transition-colors border-b-2 border-slate-900 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center text-white shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Tools Tambahan
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Kalkulator Subnetting IPv4, Analisis Kelas, Konversi Format, dan Perencanaan Jaringan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ChevronDown
            className={`w-5 h-5 text-slate-900 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </div>
      </button>

      {/* Collapsible Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-6 space-y-6">
              {/* ======================================================== */}
              {/* 1. KHUSUS: MASUKKAN ALAMAT IP (KALKULATOR SUBNETTING IPV4) */}
              {/* ======================================================== */}
              <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-blue-50/70 via-white to-sky-50/70 p-4 sm:p-5 shadow-[3px_3px_0px_0px_#0f172a] space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-slate-200 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 border-2 border-slate-900 text-white flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#0f172a]">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                        MASUKKAN ALAMAT IP (Kalkulator Subnetting IPv4)
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        Kalkulasi Netmask, Network, Broadcast, Range Host, dan Visualisasi Biner
                      </p>
                    </div>
                  </div>

                  {/* Preset Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 md:pt-0">
                    <span className="text-xs text-slate-500 font-bold">Preset:</span>
                    {["192.168.1.1", "10.0.0.1", "172.16.10.5", "192.168.1.1/26"].map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePresetIP(p)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-900 font-mono text-xs font-bold shadow-[1.5px_1.5px_0px_0px_#0f172a] active:translate-y-0.5 transition-all"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Field & Submit Trigger */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => {
                      setIpInput(e.target.value);
                      if (!e.target.value) setSubmittedIP("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleCalculateIP()}
                    placeholder="Ketik Alamat IP (contoh: 192.168.1.1 atau 10.0.0.1/24) ..."
                    className="flex-1 min-w-0 bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 font-mono text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:truncate focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCalculateIP}
                      title="Hitung Subnet"
                      className="flex-1 sm:flex-none h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center neo-btn"
                    >
                      Hitung
                    </button>
                    {ipInput && (
                      <button
                        onClick={handleResetIP}
                        title="Reset IP"
                        className="w-11 h-11 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border-2 border-slate-900 flex items-center justify-center neo-btn-sm shrink-0"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Validation Feedback */}
                {ipInput && !ipInfo && (
                  <p className="text-xs text-rose-600 font-bold flex items-center gap-1 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    ⚠ Format IP tidak valid. Gunakan format desimal bertitik (0-255 tiap oktet, misal: 192.168.1.1).
                  </p>
                )}

                {/* Detected IP summary badge */}
                {ipInfo && (
                  <div className="text-xs text-slate-900 font-bold bg-white py-2.5 px-3.5 rounded-xl border-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="break-words">
                        IP Terdeteksi: <strong className="font-mono text-blue-700">{ipInfo.ip}</strong> — Kelas {ipInfo.ipClass} ({ipInfo.classDescription})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                      <span className="font-mono px-2 py-0.5 rounded bg-blue-600 text-white text-[11px]">
                        CIDR /{ipInfo.cidr}
                      </span>
                      <span className="font-mono px-2 py-0.5 rounded bg-slate-900 text-white text-[11px]">
                        Mask: {ipInfo.netmask}
                      </span>
                    </div>
                  </div>
                )}

                {/* Detailed Subnetting Calculation Results */}
                <AnimatePresence>
                  {ipInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4 pt-2 border-t-2 border-slate-200"
                    >
                      {/* Network Cards */}
                      <div>
                        <NetworkCards info={ipInfo} />
                      </div>

                      {/* CIDR Reference Table */}
                      <div>
                        <CIDRReferenceTable ipClass={ipInfo.ipClass} />
                      </div>

                      {/* Subnetting Table */}
                      <div>
                        <SubnettingTable info={ipInfo} />
                      </div>

                      {/* Binary Visual Representation */}
                      <div>
                        <BinaryVisual info={ipInfo} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ======================================================== */}
              {/* 2. GRID 4 PERALATAN JARINGAN PENDUKUNG */}
              {/* ======================================================== */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* 1. Pengecek IP Publik vs Privat */}
                <div className="rounded-2xl border-2 border-slate-900 bg-rose-50/50 p-4 flex flex-col justify-between shadow-[3px_3px_0px_0px_#0f172a] space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-100 border border-slate-900 text-rose-600 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Pengecek IP Publik vs Privat</h4>
                        <p className="text-[10px] text-slate-500">Alamat IP untuk Dicek:</p>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={checkIpInput}
                        onChange={(e) => setCheckIpInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCheckIP()}
                        placeholder="Contoh: 192.168.1.1 atau 8.8.8.8"
                        className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 pr-8"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                    </div>

                    {checkResult && (
                      <div className="bg-white rounded-lg p-2 border border-slate-900 text-[11px] font-medium space-y-0.5 shadow-2xs">
                        <p className="font-bold text-slate-900 uppercase">{checkResult.type === "private" ? "IP Private" : "IP Public"}</p>
                        <p className="text-slate-600 text-[10px]">{checkResult.description}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCheckIP}
                    className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center neo-btn mt-2"
                  >
                    Cek IP Address
                  </button>
                </div>

                {/* 2. Konverter Format IP (Multi-Base) */}
                <div className="rounded-2xl border-2 border-slate-900 bg-purple-50/50 p-4 flex flex-col justify-between shadow-[3px_3px_0px_0px_#0f172a] space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 border border-slate-900 text-purple-600 flex items-center justify-center shrink-0">
                          <ArrowRightLeft className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">Konverter Format IP</h4>
                          <p className="text-[10px] text-slate-500">Dotted, Hex, atau Integer:</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-200 text-purple-900 border border-slate-900">
                        IPv4
                      </span>
                    </div>

                    <input
                      type="text"
                      value={formatIpInput}
                      onChange={(e) => setFormatIpInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleConvertFormat()}
                      placeholder="192.168.1.1"
                      className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />

                    {/* Preset pills */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                      <span className="text-slate-400">Contoh:</span>
                      {["192.168.1.1", "10.0.0.1", "172.16.254.1"].map((ip) => (
                        <button
                          key={ip}
                          onClick={() => {
                            setFormatIpInput(ip);
                            setFormatResult(convertIPToAllBases(ip));
                          }}
                          className="px-1.5 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-mono font-semibold"
                        >
                          {ip}
                        </button>
                      ))}
                    </div>

                    {formatResult && (
                      <div className="bg-white rounded-lg p-2 border border-slate-900 text-[10px] font-mono space-y-1 shadow-2xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">BIN:</span>
                          <span className="font-bold text-slate-900 truncate max-w-[130px]">{formatResult.dottedBinary}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">HEX:</span>
                          <span className="font-bold text-purple-700">{formatResult.fullHex}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">INT:</span>
                          <span className="font-bold text-blue-700">{formatResult.integerDecimal}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleConvertFormat}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center neo-btn mt-2"
                  >
                    Konversi Format
                  </button>
                </div>

                {/* 3. Kalkulator Pembagian Subnet */}
                <div className="rounded-2xl border-2 border-slate-900 bg-emerald-50/50 p-4 flex flex-col justify-between shadow-[3px_3px_0px_0px_#0f172a] space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-slate-900 text-emerald-600 flex items-center justify-center shrink-0">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Kalkulator Pembagian Subnet</h4>
                        <p className="text-[10px] text-slate-500">Network &amp; Jumlah Subnet</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      <input
                        type="text"
                        value={subnetNetwork}
                        onChange={(e) => setSubnetNetwork(e.target.value)}
                        placeholder="Network (192.1)"
                        className="col-span-3 bg-white border-2 border-slate-900 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={subnetPrefix}
                        onChange={(e) => setSubnetPrefix(e.target.value)}
                        placeholder="24"
                        className="col-span-1 bg-white border-2 border-slate-900 rounded-xl px-1.5 py-2 text-xs font-mono font-bold text-slate-900 text-center focus:outline-none"
                      />
                      <input
                        type="number"
                        value={subnetCount}
                        onChange={(e) => setSubnetCount(e.target.value)}
                        placeholder="2"
                        className="col-span-1 bg-white border-2 border-slate-900 rounded-xl px-1.5 py-2 text-xs font-mono font-bold text-slate-900 text-center focus:outline-none"
                      />
                    </div>

                    {subnetResult && (
                      <div className="bg-white rounded-lg p-2 border border-slate-900 text-[10px] font-mono space-y-0.5 shadow-2xs">
                        <p className="font-bold text-emerald-800">Mask: {subnetResult.subnetMask}</p>
                        <p className="text-slate-600 truncate">Subnet 1: {subnetResult.subnets[0]?.networkAddress}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCalculateSubnet}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center neo-btn mt-2"
                  >
                    Hitung Subnet
                  </button>
                </div>

                {/* 4. Perencanaan Kebutuhan Host */}
                <div className="rounded-2xl border-2 border-slate-900 bg-amber-50/50 p-4 flex flex-col justify-between shadow-[3px_3px_0px_0px_#0f172a] space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 border border-slate-900 text-amber-700 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Perencanaan Kebutuhan Host</h4>
                        <p className="text-[10px] text-slate-500">Estimasi Kebutuhan Client</p>
                      </div>
                    </div>

                    <input
                      type="number"
                      value={hostCount}
                      onChange={(e) => setHostCount(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handlePlanHosts()}
                      placeholder="Jumlah host (misal: 50)"
                      className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />

                    {planResult && (
                      <div className="bg-white rounded-lg p-2 border border-slate-900 text-[10px] font-mono space-y-0.5 shadow-2xs">
                        <p className="font-bold text-amber-800">Prefix /{planResult.cidr} ({planResult.usableHosts} host)</p>
                        <p className="text-slate-600 text-[9px] truncate">{planResult.recommendation}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handlePlanHosts}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center neo-btn mt-2"
                  >
                    Hitung
                  </button>
                </div>
              </div>

              {/* ======================================================== */}
              {/* 3. TABEL RENTANG KELAS IP */}
              {/* ======================================================== */}
              <div>
                <IPClassRanges />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolsTambahan;
