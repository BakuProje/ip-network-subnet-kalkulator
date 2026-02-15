import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen } from "lucide-react";

interface CIDRRow {
  cidr: string;
  subnetMask: string;
  jumlahSubnet: string;
  hostPerSubnet: string;
}

const cidrDataByClass: Record<string, CIDRRow[]> = {
  A: [
    { cidr: "/8", subnetMask: "255.0.0.0", jumlahSubnet: "1", hostPerSubnet: "16,777,214" },
    { cidr: "/9", subnetMask: "255.128.0.0", jumlahSubnet: "2", hostPerSubnet: "8,388,606" },
    { cidr: "/10", subnetMask: "255.192.0.0", jumlahSubnet: "4", hostPerSubnet: "4,194,302" },
    { cidr: "/11", subnetMask: "255.224.0.0", jumlahSubnet: "8", hostPerSubnet: "2,097,150" },
    { cidr: "/12", subnetMask: "255.240.0.0", jumlahSubnet: "16", hostPerSubnet: "1,048,574" },
    { cidr: "/13", subnetMask: "255.248.0.0", jumlahSubnet: "32", hostPerSubnet: "524,286" },
    { cidr: "/14", subnetMask: "255.252.0.0", jumlahSubnet: "64", hostPerSubnet: "262,142" },
    { cidr: "/15", subnetMask: "255.254.0.0", jumlahSubnet: "128", hostPerSubnet: "131,070" },
    { cidr: "/16", subnetMask: "255.255.0.0", jumlahSubnet: "256", hostPerSubnet: "65,534" },
    { cidr: "/17", subnetMask: "255.255.128.0", jumlahSubnet: "512", hostPerSubnet: "32,766" },
    { cidr: "/24", subnetMask: "255.255.255.0", jumlahSubnet: "65,536", hostPerSubnet: "254" },
    { cidr: "/30", subnetMask: "255.255.255.252", jumlahSubnet: "4,194,304", hostPerSubnet: "2" },
  ],
  B: [
    { cidr: "/16", subnetMask: "255.255.0.0", jumlahSubnet: "1", hostPerSubnet: "65,534" },
    { cidr: "/17", subnetMask: "255.255.128.0", jumlahSubnet: "2", hostPerSubnet: "32,766" },
    { cidr: "/18", subnetMask: "255.255.192.0", jumlahSubnet: "4", hostPerSubnet: "16,382" },
    { cidr: "/19", subnetMask: "255.255.224.0", jumlahSubnet: "8", hostPerSubnet: "8,190" },
    { cidr: "/20", subnetMask: "255.255.240.0", jumlahSubnet: "16", hostPerSubnet: "4,094" },
    { cidr: "/21", subnetMask: "255.255.248.0", jumlahSubnet: "32", hostPerSubnet: "2,046" },
    { cidr: "/22", subnetMask: "255.255.252.0", jumlahSubnet: "64", hostPerSubnet: "1,022" },
    { cidr: "/23", subnetMask: "255.255.254.0", jumlahSubnet: "128", hostPerSubnet: "510" },
    { cidr: "/24", subnetMask: "255.255.255.0", jumlahSubnet: "256", hostPerSubnet: "254" },
    { cidr: "/25", subnetMask: "255.255.255.128", jumlahSubnet: "512", hostPerSubnet: "126" },
    { cidr: "/26", subnetMask: "255.255.255.192", jumlahSubnet: "1,024", hostPerSubnet: "62" },
    { cidr: "/27", subnetMask: "255.255.255.224", jumlahSubnet: "2,048", hostPerSubnet: "30" },
    { cidr: "/28", subnetMask: "255.255.255.240", jumlahSubnet: "4,096", hostPerSubnet: "14" },
    { cidr: "/29", subnetMask: "255.255.255.248", jumlahSubnet: "8,192", hostPerSubnet: "6" },
    { cidr: "/30", subnetMask: "255.255.255.252", jumlahSubnet: "16,384", hostPerSubnet: "2" },
  ],
  C: [
    { cidr: "/24", subnetMask: "255.255.255.0", jumlahSubnet: "1", hostPerSubnet: "254" },
    { cidr: "/25", subnetMask: "255.255.255.128", jumlahSubnet: "2", hostPerSubnet: "126" },
    { cidr: "/26", subnetMask: "255.255.255.192", jumlahSubnet: "4", hostPerSubnet: "62" },
    { cidr: "/27", subnetMask: "255.255.255.224", jumlahSubnet: "8", hostPerSubnet: "30" },
    { cidr: "/28", subnetMask: "255.255.255.240", jumlahSubnet: "16", hostPerSubnet: "14" },
    { cidr: "/29", subnetMask: "255.255.255.248", jumlahSubnet: "32", hostPerSubnet: "6" },
    { cidr: "/30", subnetMask: "255.255.255.252", jumlahSubnet: "64", hostPerSubnet: "2" },
  ],
  D: [
    { cidr: "N/A", subnetMask: "N/A", jumlahSubnet: "Multicast", hostPerSubnet: "224.0.0.0 - 239.255.255.255" },
  ],
  E: [
    { cidr: "N/A", subnetMask: "N/A", jumlahSubnet: "Reserved", hostPerSubnet: "240.0.0.0 - 255.255.255.255" },
  ],
};

interface Props {
  ipClass: string;
}

const CIDRReferenceTable = ({ ipClass }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const rows = cidrDataByClass[ipClass] || [];

  // Tentukan nama kolom berdasarkan kelas
  const getColumnHeaders = () => {
    if (ipClass === "A") {
      return {
        col3: "Jumlah Subnet",
        col4: "Total Host per Subnet",
      };
    } else if (ipClass === "B") {
      return {
        col3: "Jumlah Subnet",
        col4: "Host Valid",
      };
    } else if (ipClass === "C") {
      return {
        col3: "Jumlah Subnet",
        col4: "Host/Subnet",
      };
    } else {
      return {
        col3: "Type",
        col4: "Range",
      };
    }
  };

  const headers = getColumnHeaders();

  // Tentukan subnet mask default dan keterangan
  const getClassInfo = () => {
    if (ipClass === "A") {
      return {
        defaultMask: "255.0.0.0",
        description: `${rows.length} notasi CIDR`,
      };
    } else if (ipClass === "B") {
      return {
        defaultMask: "255.255.0.0",
        description: `${rows.length} notasi CIDR`,
      };
    } else if (ipClass === "C") {
      return {
        defaultMask: "255.255.255.0",
        description: `${rows.length} notasi CIDR`,
      };
    } else if (ipClass === "D") {
      return {
        defaultMask: null,
        description: "Multicast Address",
      };
    } else if (ipClass === "E") {
      return {
        defaultMask: null,
        description: "Reserved Address",
      };
    } else {
      return {
        defaultMask: null,
        description: "",
      };
    }
  };

  const classInfo = getClassInfo();

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 hover:from-primary/15 hover:via-secondary/15 hover:to-accent/15 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <div className="text-left">
            <h3 className="font-bold text-foreground">Tabel Referensi CIDR Kelas {ipClass}</h3>
            <p className="text-xs text-muted-foreground">
              {classInfo.description}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-muted/30 border-t border-border">
                    <th className="px-4 py-3 text-left text-muted-foreground font-semibold">CIDR</th>
                    <th className="px-4 py-3 text-left text-muted-foreground font-semibold">Subnet Mask</th>
                    <th className="px-4 py-3 text-left text-muted-foreground font-semibold">{headers.col3}</th>
                    <th className="px-4 py-3 text-left text-muted-foreground font-semibold">{headers.col4}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <motion.tr
                      key={row.cidr}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-t border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-primary font-bold">{row.cidr}</td>
                      <td className="px-4 py-2.5 text-foreground">{row.subnetMask}</td>
                      <td className="px-4 py-2.5 text-accent">{row.jumlahSubnet}</td>
                      <td className="px-4 py-2.5 text-secondary">{row.hostPerSubnet}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CIDRReferenceTable;
