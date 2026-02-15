import { motion } from "framer-motion";
import { Globe, Shield, Wifi, Router, Hash, Server, Users, Cable, Tag, Layers } from "lucide-react";
import type { IPInfo } from "@/lib/subnet";

interface Props {
  info: IPInfo;
}

const cardData = (info: IPInfo) => {
  // Tentukan subnet mask default berdasarkan kelas
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
    { label: "Alamat IP", value: info.ip, icon: Globe, color: "primary" },
    { label: "Kelas IP", value: `Kelas ${info.ipClass}`, desc: info.classDescription, icon: Tag, color: "accent" },
    { label: "Netmask", value: info.netmask, icon: Shield, color: "primary" },
    { label: "Subnet Mask Default", value: defaultSubnetMask, desc: `Default untuk Kelas ${info.ipClass}`, icon: Shield, color: "primary" },
    { label: "Wildcard Mask", value: info.wildcard, icon: Wifi, color: "secondary" },
    { label: "Network Address", value: info.networkAddress, icon: Router, color: "primary" },
    { label: "Broadcast Address", value: info.broadcastAddress, icon: Layers, color: "accent" },
    { label: "Range IP Valid", value: `${info.firstHost} — ${info.lastHost}`, icon: Cable, color: "secondary" },
    { label: "Jumlah Host Total", value: info.totalHosts.toLocaleString(), icon: Server, color: "primary" },
    { label: "Jumlah Host Valid / Client", value: info.validHosts.toLocaleString(), icon: Users, color: "secondary" },
    { label: "Notasi CIDR", value: `/${info.cidr}`, icon: Hash, color: "accent" },
  ];
};

const colorMap: Record<string, string> = {
  primary: "text-primary border-primary/20 bg-primary/5",
  secondary: "text-secondary border-secondary/20 bg-secondary/5",
  accent: "text-accent border-accent/20 bg-accent/5",
};

const glowMap: Record<string, string> = {
  primary: "glow-primary-hover",
  secondary: "glow-secondary-hover",
  accent: "glow-secondary-hover",
};

const NetworkCards = ({ info }: Props) => {
  const cards = cardData(info);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-xl border bg-card p-4 transition-all duration-300 ${glowMap[card.color]} hover:border-opacity-60`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${colorMap[card.color]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">{card.label}</p>
                <p className="font-mono text-sm font-semibold text-foreground truncate">{card.value}</p>
                {card.desc && (
                  <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default NetworkCards;
