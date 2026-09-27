import { useState, useEffect } from "react";
import { convertIPToAllBases, IPAllBasesResult } from "@/lib/numberSystems";

const IPToBinaryConverter = () => {
  const [ipInput, setIpInput] = useState("192.168.1.1");
  const [result, setResult] = useState<IPAllBasesResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!ipInput.trim()) {
      setResult(null);
      return;
    }
    const converted = convertIPToAllBases(ipInput);
    setResult(converted);
  }, [ipInput]);

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleIPs = [
    { label: "192.168.1.1", val: "192.168.1.1" },
    { label: "10.0.0.1", val: "10.0.0.1" },
    { label: "172.16.254.1", val: "172.16.254.1" },
    { label: "0xC0A80101", val: "0xC0A80101" },
  ];

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Konverter Format IP (Multi-Base)
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
          IPv4 Formats
        </span>
      </div>

      <div className="space-y-3">
        {/* Input */}
        <div>
          <label className="text-xs text-neutral-500 font-medium mb-1 block">
            Alamat IP (Dotted Decimal, Hex 32-bit, atau Integer):
          </label>
          <input
            type="text"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="Contoh: 192.168.1.1 atau 0xC0A80101"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          />
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] text-neutral-400 mr-1">Contoh:</span>
          {sampleIPs.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setIpInput(s.val)}
              className="px-2 py-0.5 text-[11px] font-mono rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        {result && (
          <div className="space-y-3 pt-2">
            {/* Output Formats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. Dotted Binary */}
              <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-600 font-semibold">
                    Biner Bertitik (8-bit)
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.dottedBinary, "bin")}
                    className="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium"
                  >
                    {copiedKey === "bin" ? "Disalin" : "Salin"}
                  </button>
                </div>
                <p className="font-mono text-xs text-neutral-900 font-bold break-all">
                  {result.dottedBinary}
                </p>
              </div>

              {/* 2. Dotted Hex & Full Hex */}
              <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-600 font-semibold">
                    Heksadesimal
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.fullHex, "hex")}
                    className="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium"
                  >
                    {copiedKey === "hex" ? "Disalin" : "Salin"}
                  </button>
                </div>
                <div className="flex items-center justify-between font-mono text-xs text-neutral-900 font-bold">
                  <span>{result.dottedHex}</span>
                  <span className="text-neutral-600 font-normal">{result.fullHex}</span>
                </div>
              </div>

              {/* 3. Dotted Octal */}
              <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-600 font-semibold">
                    Oktal Bertitik
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.dottedOctal, "oct")}
                    className="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium"
                  >
                    {copiedKey === "oct" ? "Disalin" : "Salin"}
                  </button>
                </div>
                <p className="font-mono text-xs text-neutral-900 font-bold">
                  {result.dottedOctal}
                </p>
              </div>

              {/* 4. Integer / DWORD */}
              <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-600 font-semibold">
                    Desimal Integer (DWORD 32-bit)
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.integerDecimal, "int")}
                    className="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium"
                  >
                    {copiedKey === "int" ? "Disalin" : "Salin"}
                  </button>
                </div>
                <p className="font-mono text-xs text-neutral-900 font-bold">
                  {result.integerDecimal}
                </p>
              </div>
            </div>

            {/* Per Octet Matrix */}
            <div className="space-y-1.5 pt-1">
              <p className="text-xs text-neutral-500 font-medium">
                Rincian Per-Oktet:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {result.octets.map((octet, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-50 rounded-lg p-2.5 border border-neutral-200 text-center space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 border-b border-neutral-200 pb-1">
                      <span>Oktet {octet.octetIndex}</span>
                      <span className="font-mono font-bold text-neutral-900">
                        {octet.decimal}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono space-y-0.5 text-left pt-0.5">
                      <div className="flex justify-between text-neutral-600">
                        <span>BIN:</span>
                        <span className="text-neutral-900 font-medium">{octet.binary}</span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>OCT:</span>
                        <span className="text-neutral-900 font-medium">{octet.octal}</span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>HEX:</span>
                        <span className="text-neutral-900 font-medium">{octet.hex}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPToBinaryConverter;
