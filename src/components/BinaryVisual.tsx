import type { IPInfo } from "@/lib/subnet";

interface Props {
  info: IPInfo;
}

const BinaryVisual = ({ info }: Props) => {
  const networkBits = info.cidr;

  const renderBits = (binaryOctets: string[], label: string) => {
    let bitIndex = 0;
    return (
      <div>
        <p className="text-xs text-slate-700 mb-2 font-bold uppercase tracking-wider">{label}</p>
        <div className="flex flex-wrap gap-1.5 items-center">
          {binaryOctets.map((octet, oi) => (
            <div key={oi} className="flex items-center gap-0.5">
              {octet.split("").map((bit, bi) => {
                const currentBitIndex = bitIndex++;
                const isNetwork = currentBitIndex < networkBits;
                return (
                  <span
                    key={bi}
                    className={`inline-flex items-center justify-center w-5 h-6 text-xs font-mono font-black rounded-lg border border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] ${
                      isNetwork
                        ? "bg-blue-600 text-white"
                        : "bg-emerald-400 text-slate-950"
                    }`}
                  >
                    {bit}
                  </span>
                );
              })}
              {oi < 3 && (
                <span className="text-slate-900 font-mono text-sm mx-0.5 font-black">.</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="neo-box bg-white p-5 space-y-4">
      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
        Visualisasi Bit Biner (Network vs Host)
      </h3>

      {renderBits(info.ipBinary, "Alamat IP")}
      {renderBits(info.netmaskBinary, "Netmask")}

      <div className="flex items-center gap-4 pt-3 border-t-2 border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-blue-600 border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]" />
          <span className="text-xs text-slate-800 font-bold">Network ({info.cidr} bit)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-emerald-400 border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]" />
          <span className="text-xs text-slate-800 font-bold">Host ({32 - info.cidr} bit)</span>
        </div>
      </div>
    </div>
  );
};

export default BinaryVisual;
