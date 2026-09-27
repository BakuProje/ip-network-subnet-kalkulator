import type { IPInfo } from "@/lib/subnet";

interface Props {
  info: IPInfo;
}

const cardData = (info: IPInfo) => {
  const getDefaultSubnetMask = (ipClass: string) => {
    switch (ipClass) {
      case "A":
        return "255.0.0.0";
      case "B":
        return "255.255.0.0";
      case "C":
        return "255.255.255.0";
      case "D":
        return "Tidak memiliki Subnet Mask";
      case "E":
        return "Tidak memiliki Subnet Mask";
      default:
        return "N/A";
    }
  };

  const defaultSubnetMask = getDefaultSubnetMask(info.ipClass);

  return [
    { label: "Alamat IP", value: info.ip, badgeColor: "bg-blue-600 text-white" },
    { label: "Kelas IP", value: `Kelas ${info.ipClass}`, desc: info.classDescription, badgeColor: "bg-purple-600 text-white" },
    { label: "Netmask", value: info.netmask, badgeColor: "bg-blue-600 text-white" },
    { label: "Subnet Mask Default", value: defaultSubnetMask, desc: `Default Kelas ${info.ipClass}`, badgeColor: "bg-emerald-600 text-white" },
    { label: "Wildcard Mask", value: info.wildcard, badgeColor: "bg-purple-600 text-white" },
    { label: "Network Address", value: info.networkAddress, badgeColor: "bg-blue-600 text-white" },
    { label: "Broadcast Address", value: info.broadcastAddress, badgeColor: "bg-amber-500 text-white" },
    { label: "Range IP Valid", value: `${info.firstHost} — ${info.lastHost}`, badgeColor: "bg-emerald-600 text-white" },
    { label: "Jumlah Host Total", value: info.totalHosts.toLocaleString(), badgeColor: "bg-blue-600 text-white" },
    { label: "Jumlah Host Valid / Client", value: info.validHosts.toLocaleString(), badgeColor: "bg-emerald-600 text-white" },
    { label: "Notasi CIDR", value: `/${info.cidr}`, badgeColor: "bg-amber-500 text-white" },
  ];
};

const NetworkCards = ({ info }: Props) => {
  const cards = cardData(info);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_#0f172a] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
        >
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              {card.label}
            </p>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${card.badgeColor} border border-slate-900`}>
              OK
            </span>
          </div>
          <p className="font-mono text-sm font-black text-slate-900 truncate">
            {card.value}
          </p>
          {card.desc && (
            <p className="text-[11px] text-slate-500 font-medium mt-1">{card.desc}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default NetworkCards;
