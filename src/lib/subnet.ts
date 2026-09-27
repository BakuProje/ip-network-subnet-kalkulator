// IP Subnet Calculator utility functions

export interface IPInfo {
  ip: string;
  octets: number[];
  ipClass: string;
  classDescription: string;
  netmask: string;
  netmaskOctets: number[];
  wildcard: string;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  validHosts: number;
  cidr: number;
  ipBinary: string[];
  netmaskBinary: string[];
}

export interface SubnetRow {
  no: number;
  networkId: string;
  rangeStart: string;
  rangeEnd: string;
  broadcast: string;
  netmask: string;
  wildcard: string;
}

export function isValidIP(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    const n = Number(p);
    return p !== "" && !isNaN(n) && n >= 0 && n <= 255 && String(n) === p;
  });
}

export function octetToBinary(n: number): string {
  return n.toString(2).padStart(8, "0");
}

function ipToNum(octets: number[]): number {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}

function numToOctets(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

function octetsToString(o: number[]): string {
  return o.join(".");
}

function getClass(firstOctet: number): { ipClass: string; cidr: number; description: string } {
  if (firstOctet <= 127) return { ipClass: "A", cidr: 8, description: "Jaringan besar (1.0.0.0 - 126.255.255.255)" };
  if (firstOctet <= 191) return { ipClass: "B", cidr: 16, description: "Jaringan menengah (128.0.0.0 - 191.255.255.255)" };
  if (firstOctet <= 223) return { ipClass: "C", cidr: 24, description: "Jaringan kecil (192.0.0.0 - 223.255.255.255)" };
  if (firstOctet <= 239) return { ipClass: "D", cidr: 0, description: "Multicast (224.0.0.0 - 239.255.255.255)" };
  return { ipClass: "E", cidr: 0, description: "Eksperimental (240.0.0.0 - 255.255.255.255)" };
}

function cidrToMask(cidr: number): number {
  return cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
}

export function calculateIP(ip: string): IPInfo | null {
  if (!isValidIP(ip)) return null;
  const octets = ip.split(".").map(Number);
  const { ipClass, cidr, description } = getClass(octets[0]);

  const effectiveCidr = cidr || 32;
  const maskNum = cidrToMask(effectiveCidr);
  const netmaskOctets = numToOctets(maskNum);
  const wildcardOctets = netmaskOctets.map((o) => 255 - o);
  const ipNum = ipToNum(octets);
  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | ~maskNum) >>> 0;
  const totalHosts = Math.pow(2, 32 - effectiveCidr);
  const validHosts = totalHosts > 2 ? totalHosts - 2 : 0;
  const firstHostNum = totalHosts > 2 ? networkNum + 1 : networkNum;
  const lastHostNum = totalHosts > 2 ? broadcastNum - 1 : broadcastNum;

  return {
    ip,
    octets,
    ipClass,
    classDescription: description,
    netmask: octetsToString(netmaskOctets),
    netmaskOctets,
    wildcard: octetsToString(wildcardOctets),
    networkAddress: octetsToString(numToOctets(networkNum)),
    broadcastAddress: octetsToString(numToOctets(broadcastNum)),
    firstHost: octetsToString(numToOctets(firstHostNum)),
    lastHost: octetsToString(numToOctets(lastHostNum)),
    totalHosts,
    validHosts,
    cidr: effectiveCidr,
    ipBinary: octets.map(octetToBinary),
    netmaskBinary: netmaskOctets.map(octetToBinary),
  };
}

export function generateSubnettingTable(info: IPInfo, count: number = 10): SubnetRow[] {
  if (info.ipClass === "D" || info.ipClass === "E") return [];
  const maskNum = cidrToMask(info.cidr);
  const blockSize = Math.pow(2, 32 - info.cidr);
  // Start from 0.0.0.0 range of same class
  const classStart = ipToNum(info.octets) & maskNum;
  const rows: SubnetRow[] = [];

  for (let i = 0; i < count; i++) {
    const netNum = (classStart + i * blockSize) >>> 0;
    const bcastNum = (netNum + blockSize - 1) >>> 0;
    const firstNum = netNum + 1;
    const lastNum = bcastNum - 1;

    if (netNum > 0xffffffff) break;

    rows.push({
      no: i + 1,
      networkId: octetsToString(numToOctets(netNum)),
      rangeStart: octetsToString(numToOctets(firstNum)),
      rangeEnd: octetsToString(numToOctets(lastNum)),
      broadcast: octetsToString(numToOctets(bcastNum)),
      netmask: info.netmask,
      wildcard: info.wildcard,
    });
  }
  return rows;
}

export function binaryToDecimal(bin: string): number | null {
  if (!/^[01]+$/.test(bin)) return null;
  return parseInt(bin, 2);
}

export function decimalToBinary(dec: number): string | null {
  if (isNaN(dec) || dec < 0) return null;
  return dec.toString(2);
}

export function decimalToOctal(dec: number): string | null {
  if (isNaN(dec) || dec < 0) return null;
  return dec.toString(8);
}

export function octalToDecimal(oct: string): number | null {
  if (!/^[0-7]+$/.test(oct)) return null;
  return parseInt(oct, 8);
}

export function decimalToHex(dec: number): string | null {
  if (isNaN(dec) || dec < 0) return null;
  return dec.toString(16).toUpperCase();
}

export function hexToDecimal(hex: string): number | null {
  if (!/^[0-9A-Fa-f]+$/.test(hex)) return null;
  return parseInt(hex, 16);
}

export function binaryToOctal(bin: string): string | null {
  const dec = binaryToDecimal(bin);
  return dec !== null ? decimalToOctal(dec) : null;
}

export function octalToBinary(oct: string): string | null {
  const dec = octalToDecimal(oct);
  return dec !== null ? decimalToBinary(dec) : null;
}

export function binaryToHex(bin: string): string | null {
  const dec = binaryToDecimal(bin);
  return dec !== null ? decimalToHex(dec) : null;
}

export function hexToBinary(hex: string): string | null {
  const dec = hexToDecimal(hex);
  return dec !== null ? decimalToBinary(dec) : null;
}

