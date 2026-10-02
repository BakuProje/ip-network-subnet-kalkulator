// ASCII & BCD (Binary Coded Decimal) Utility

// ============================================================================
// 1. ASCII DATA STRUCTURES & UTILITIES
// ============================================================================

export interface AsciiEntry {
  code: number;
  char: string;
  name: string;
  category: "control" | "digit" | "uppercase" | "lowercase" | "symbol" | "extended";
  bin: string;
  hex: string;
  oct: string;
  altCode: string;
  description: string;
}

// Full 0 - 255 Standard & Extended ASCII Table
export const ASCII_TABLE: AsciiEntry[] = [
  { code: 0, char: "NUL", name: "Null", category: "control", bin: "00000000", hex: "00", oct: "000", altCode: "Alt+0", description: "Null character (Karakter kosong/terminator string)" },
  { code: 1, char: "SOH", name: "Start of Heading", category: "control", bin: "00000001", hex: "01", oct: "001", altCode: "Alt+1", description: "Awal dari header komunikasi" },
  { code: 2, char: "STX", name: "Start of Text", category: "control", bin: "00000010", hex: "02", oct: "002", altCode: "Alt+2", description: "Awal teks data" },
  { code: 3, char: "ETX", name: "End of Text", category: "control", bin: "00000011", hex: "03", oct: "003", altCode: "Alt+3", description: "Akhir teks data" },
  { code: 4, char: "EOT", name: "End of Transmission", category: "control", bin: "00000100", hex: "04", oct: "004", altCode: "Alt+4", description: "Akhir transmisi komunikasi" },
  { code: 5, char: "ENQ", name: "Enquiry", category: "control", bin: "00000101", hex: "05", oct: "005", altCode: "Alt+5", description: "Permintaan status stasiun penerima" },
  { code: 6, char: "ACK", name: "Acknowledge", category: "control", bin: "00000110", hex: "06", oct: "006", altCode: "Alt+6", description: "Konfirmasi penerimaan data sukses" },
  { code: 7, char: "BEL", name: "Bell", category: "control", bin: "00000111", hex: "07", oct: "007", altCode: "Alt+7", description: "Pemberitahuan sinyal bel audio" },
  { code: 8, char: "BS", name: "Backspace", category: "control", bin: "00001000", hex: "08", oct: "010", altCode: "Alt+8", description: "Mundur 1 spasi (Backspace)" },
  { code: 9, char: "HT", name: "Horizontal Tab", category: "control", bin: "00001001", hex: "09", oct: "011", altCode: "Alt+9", description: "Tabulasi horizontal (Tab)" },
  { code: 10, char: "LF", name: "Line Feed", category: "control", bin: "00001010", hex: "0A", oct: "012", altCode: "Alt+10", description: "Ganti baris baru (Line Feed / Enter)" },
  { code: 11, char: "VT", name: "Vertical Tab", category: "control", bin: "00001011", hex: "0B", oct: "013", altCode: "Alt+11", description: "Tabulasi vertikal" },
  { code: 12, char: "FF", name: "Form Feed", category: "control", bin: "00001100", hex: "0C", oct: "014", altCode: "Alt+12", description: "Ganti halaman cetak (Page break)" },
  { code: 13, char: "CR", name: "Carriage Return", category: "control", bin: "00001101", hex: "0D", oct: "015", altCode: "Alt+13", description: "Kembali ke awal baris (Enter)" },
  { code: 14, char: "SO", name: "Shift Out", category: "control", bin: "00001110", hex: "0E", oct: "016", altCode: "Alt+14", description: "Beralih ke set karakter alternatif" },
  { code: 15, char: "SI", name: "Shift In", category: "control", bin: "00001111", hex: "0F", oct: "017", altCode: "Alt+15", description: "Kembali ke set karakter standar" },
  { code: 16, char: "DLE", name: "Data Link Escape", category: "control", bin: "00010000", hex: "10", oct: "020", altCode: "Alt+16", description: "Transmisi karakter khusus escape" },
  { code: 17, char: "DC1", name: "Device Control 1", category: "control", bin: "00010001", hex: "11", oct: "021", altCode: "Alt+17", description: "Kontrol perangkat (XON - Lanjut kirim)" },
  { code: 18, char: "DC2", name: "Device Control 2", category: "control", bin: "00010010", hex: "12", oct: "022", altCode: "Alt+18", description: "Kontrol perangkat khusus 2" },
  { code: 19, char: "DC3", name: "Device Control 3", category: "control", bin: "00010011", hex: "13", oct: "023", altCode: "Alt+19", description: "Kontrol perangkat (XOFF - Berhenti kirim)" },
  { code: 20, char: "DC4", name: "Device Control 4", category: "control", bin: "00010100", hex: "14", oct: "024", altCode: "Alt+20", description: "Kontrol perangkat khusus 4" },
  { code: 21, char: "NAK", name: "Negative Acknowledge", category: "control", bin: "00010101", hex: "15", oct: "025", altCode: "Alt+21", description: "Pemberitahuan transmisi gagal/error" },
  { code: 22, char: "SYN", name: "Synchronous Idle", category: "control", bin: "00010110", hex: "16", oct: "026", altCode: "Alt+22", description: "Sinyal sinkronisasi komunikasi serial" },
  { code: 23, char: "ETB", name: "End of Trans. Block", category: "control", bin: "00010111", hex: "17", oct: "027", altCode: "Alt+23", description: "Akhir blok transmisi data" },
  { code: 24, char: "CAN", name: "Cancel", category: "control", bin: "00011000", hex: "18", oct: "030", altCode: "Alt+24", description: "Pembatalan proses" },
  { code: 25, char: "EM", name: "End of Medium", category: "control", bin: "00011001", hex: "19", oct: "031", altCode: "Alt+25", description: "Akhir media penyimpanan/kertas" },
  { code: 26, char: "SUB", name: "Substitute", category: "control", bin: "00011010", hex: "1A", oct: "032", altCode: "Alt+26", description: "Pengganti karakter yang rusak/invalid" },
  { code: 27, char: "ESC", name: "Escape", category: "control", bin: "00011011", hex: "1B", oct: "033", altCode: "Alt+27", description: "Tombol Escape (Batal/Keluar sesi)" },
  { code: 28, char: "FS", name: "File Separator", category: "control", bin: "00011100", hex: "1C", oct: "034", altCode: "Alt+28", description: "Pemisah file data" },
  { code: 29, char: "GS", name: "Group Separator", category: "control", bin: "00011101", hex: "1D", oct: "035", altCode: "Alt+29", description: "Pemisah grup data" },
  { code: 30, char: "RS", name: "Record Separator", category: "control", bin: "00011110", hex: "1E", oct: "036", altCode: "Alt+30", description: "Pemisah baris record data" },
  { code: 31, char: "US", name: "Unit Separator", category: "control", bin: "00011111", hex: "1F", oct: "037", altCode: "Alt+31", description: "Pemisah unit data individual" },
  { code: 32, char: "SP", name: "Space (Spasi)", category: "symbol", bin: "00100000", hex: "20", oct: "040", altCode: "Alt+32", description: "Karakter spasi kosong" },
  { code: 33, char: "!", name: "Exclamation mark", category: "symbol", bin: "00100001", hex: "21", oct: "041", altCode: "Alt+33", description: "Tanda seru" },
  { code: 34, char: "\"", name: "Double quote", category: "symbol", bin: "00100010", hex: "22", oct: "042", altCode: "Alt+34", description: "Tanda petik ganda" },
  { code: 35, char: "#", name: "Hash / Number sign", category: "symbol", bin: "00100011", hex: "23", oct: "043", altCode: "Alt+35", description: "Tanda pagar (Hashtag)" },
  { code: 36, char: "$", name: "Dollar sign", category: "symbol", bin: "00100100", hex: "24", oct: "044", altCode: "Alt+36", description: "Simbol mata uang Dolar" },
  { code: 37, char: "%", name: "Percent sign", category: "symbol", bin: "00100101", hex: "25", oct: "045", altCode: "Alt+37", description: "Simbol persen" },
  { code: 38, char: "&", name: "Ampersand", category: "symbol", bin: "00100110", hex: "26", oct: "046", altCode: "Alt+38", description: "Simbol dan (&)" },
  { code: 39, char: "'", name: "Single quote", category: "symbol", bin: "00100111", hex: "27", oct: "047", altCode: "Alt+39", description: "Tanda petik tunggal" },
  { code: 40, char: "(", name: "Left parenthesis", category: "symbol", bin: "00101000", hex: "28", oct: "050", altCode: "Alt+40", description: "Kurung buka" },
  { code: 41, char: ")", name: "Right parenthesis", category: "symbol", bin: "00101001", hex: "29", oct: "051", altCode: "Alt+41", description: "Kurung tutup" },
  { code: 42, char: "*", name: "Asterisk", category: "symbol", bin: "00101010", hex: "2A", oct: "052", altCode: "Alt+42", description: "Bintang / simbol kali" },
  { code: 43, char: "+", name: "Plus sign", category: "symbol", bin: "00101011", hex: "2B", oct: "053", altCode: "Alt+43", description: "Tanda tambah" },
  { code: 44, char: ",", name: "Comma", category: "symbol", bin: "00101100", hex: "2C", oct: "054", altCode: "Alt+44", description: "Tanda koma" },
  { code: 45, char: "-", name: "Hyphen / Minus", category: "symbol", bin: "00101101", hex: "2D", oct: "055", altCode: "Alt+45", description: "Tanda minus / strip" },
  { code: 46, char: ".", name: "Period / Dot", category: "symbol", bin: "00101110", hex: "2E", oct: "056", altCode: "Alt+46", description: "Tanda titik" },
  { code: 47, char: "/", name: "Slash", category: "symbol", bin: "00101111", hex: "2F", oct: "057", altCode: "Alt+47", description: "Garis miring (Slash)" },
  { code: 48, char: "0", name: "Digit 0", category: "digit", bin: "00110000", hex: "30", oct: "060", altCode: "Alt+48", description: "Angka nol (0)" },
  { code: 49, char: "1", name: "Digit 1", category: "digit", bin: "00110001", hex: "31", oct: "061", altCode: "Alt+49", description: "Angka satu (1)" },
  { code: 50, char: "2", name: "Digit 2", category: "digit", bin: "00110010", hex: "32", oct: "062", altCode: "Alt+50", description: "Angka dua (2)" },
  { code: 51, char: "3", name: "Digit 3", category: "digit", bin: "00110011", hex: "33", oct: "063", altCode: "Alt+51", description: "Angka tiga (3)" },
  { code: 52, char: "4", name: "Digit 4", category: "digit", bin: "00110100", hex: "34", oct: "064", altCode: "Alt+52", description: "Angka empat (4)" },
  { code: 53, char: "5", name: "Digit 5", category: "digit", bin: "00110101", hex: "35", oct: "065", altCode: "Alt+53", description: "Angka lima (5)" },
  { code: 54, char: "6", name: "Digit 6", category: "digit", bin: "00110110", hex: "36", oct: "066", altCode: "Alt+54", description: "Angka enam (6)" },
  { code: 55, char: "7", name: "Digit 7", category: "digit", bin: "00110111", hex: "37", oct: "067", altCode: "Alt+55", description: "Angka tujuh (7)" },
  { code: 56, char: "8", name: "Digit 8", category: "digit", bin: "00111000", hex: "38", oct: "070", altCode: "Alt+56", description: "Angka delapan (8)" },
  { code: 57, char: "9", name: "Digit 9", category: "digit", bin: "00111001", hex: "39", oct: "071", altCode: "Alt+57", description: "Angka sembilan (9)" },
  { code: 58, char: ":", name: "Colon", category: "symbol", bin: "00111010", hex: "3A", oct: "072", altCode: "Alt+58", description: "Titik dua (:)" },
  { code: 59, char: ";", name: "Semicolon", category: "symbol", bin: "00111011", hex: "3B", oct: "073", altCode: "Alt+59", description: "Titik koma (;)" },
  { code: 60, char: "<", name: "Less than", category: "symbol", bin: "00111100", hex: "3C", oct: "074", altCode: "Alt+60", description: "Lebih kecil dari (<)" },
  { code: 61, char: "=", name: "Equals sign", category: "symbol", bin: "00111101", hex: "3D", oct: "075", altCode: "Alt+61", description: "Sama dengan (=)" },
  { code: 62, char: ">", name: "Greater than", category: "symbol", bin: "00111110", hex: "3E", oct: "076", altCode: "Alt+62", description: "Lebih besar dari (>)" },
  { code: 63, char: "?", name: "Question mark", category: "symbol", bin: "00111111", hex: "3F", oct: "077", altCode: "Alt+63", description: "Tanda tanya (?)" },
  { code: 64, char: "@", name: "At sign", category: "symbol", bin: "01000000", hex: "40", oct: "100", altCode: "Alt+64", description: "Simbol @ (At sign)" },
  { code: 65, char: "A", name: "Latin Capital A", category: "uppercase", bin: "01000001", hex: "41", oct: "101", altCode: "Alt+65", description: "Huruf latin kapital A" },
  { code: 66, char: "B", name: "Latin Capital B", category: "uppercase", bin: "01000010", hex: "42", oct: "102", altCode: "Alt+66", description: "Huruf latin kapital B" },
  { code: 67, char: "C", name: "Latin Capital C", category: "uppercase", bin: "01000011", hex: "43", oct: "103", altCode: "Alt+67", description: "Huruf latin kapital C" },
  { code: 68, char: "D", name: "Latin Capital D", category: "uppercase", bin: "01000100", hex: "44", oct: "104", altCode: "Alt+68", description: "Huruf latin kapital D" },
  { code: 69, char: "E", name: "Latin Capital E", category: "uppercase", bin: "01000101", hex: "45", oct: "105", altCode: "Alt+69", description: "Huruf latin kapital E" },
  { code: 70, char: "F", name: "Latin Capital F", category: "uppercase", bin: "01000110", hex: "46", oct: "106", altCode: "Alt+70", description: "Huruf latin kapital F" },
  { code: 71, char: "G", name: "Latin Capital G", category: "uppercase", bin: "01000111", hex: "47", oct: "107", altCode: "Alt+71", description: "Huruf latin kapital G" },
  { code: 72, char: "H", name: "Latin Capital H", category: "uppercase", bin: "01001000", hex: "48", oct: "110", altCode: "Alt+72", description: "Huruf latin kapital H" },
  { code: 73, char: "I", name: "Latin Capital I", category: "uppercase", bin: "01001001", hex: "49", oct: "111", altCode: "Alt+73", description: "Huruf latin kapital I" },
  { code: 74, char: "J", name: "Latin Capital J", category: "uppercase", bin: "01001010", hex: "4A", oct: "112", altCode: "Alt+74", description: "Huruf latin kapital J" },
  { code: 75, char: "K", name: "Latin Capital K", category: "uppercase", bin: "01001011", hex: "4B", oct: "113", altCode: "Alt+75", description: "Huruf latin kapital K" },
  { code: 76, char: "L", name: "Latin Capital L", category: "uppercase", bin: "01001100", hex: "4C", oct: "114", altCode: "Alt+76", description: "Huruf latin kapital L" },
  { code: 77, char: "M", name: "Latin Capital M", category: "uppercase", bin: "01001101", hex: "4D", oct: "115", altCode: "Alt+77", description: "Huruf latin kapital M" },
  { code: 78, char: "N", name: "Latin Capital N", category: "uppercase", bin: "01001110", hex: "4E", oct: "116", altCode: "Alt+78", description: "Huruf latin kapital N" },
  { code: 79, char: "O", name: "Latin Capital O", category: "uppercase", bin: "01001111", hex: "4F", oct: "117", altCode: "Alt+79", description: "Huruf latin kapital O" },
  { code: 80, char: "P", name: "Latin Capital P", category: "uppercase", bin: "01010000", hex: "50", oct: "120", altCode: "Alt+80", description: "Huruf latin kapital P" },
  { code: 81, char: "Q", name: "Latin Capital Q", category: "uppercase", bin: "01010001", hex: "51", oct: "121", altCode: "Alt+81", description: "Huruf latin kapital Q" },
  { code: 82, char: "R", name: "Latin Capital R", category: "uppercase", bin: "01010010", hex: "52", oct: "122", altCode: "Alt+82", description: "Huruf latin kapital R" },
  { code: 83, char: "S", name: "Latin Capital S", category: "uppercase", bin: "01010011", hex: "53", oct: "123", altCode: "Alt+83", description: "Huruf latin kapital S" },
  { code: 84, char: "T", name: "Latin Capital T", category: "uppercase", bin: "01010100", hex: "54", oct: "124", altCode: "Alt+84", description: "Huruf latin kapital T" },
  { code: 85, char: "U", name: "Latin Capital U", category: "uppercase", bin: "01010101", hex: "55", oct: "125", altCode: "Alt+85", description: "Huruf latin kapital U" },
  { code: 86, char: "V", name: "Latin Capital V", category: "uppercase", bin: "01010110", hex: "56", oct: "126", altCode: "Alt+86", description: "Huruf latin kapital V" },
  { code: 87, char: "W", name: "Latin Capital W", category: "uppercase", bin: "01010111", hex: "57", oct: "127", altCode: "Alt+87", description: "Huruf latin kapital W (Contoh Alt+87 di Windows)" },
  { code: 88, char: "X", name: "Latin Capital X", category: "uppercase", bin: "01011000", hex: "58", oct: "130", altCode: "Alt+88", description: "Huruf latin kapital X" },
  { code: 89, char: "Y", name: "Latin Capital Y", category: "uppercase", bin: "01011001", hex: "59", oct: "131", altCode: "Alt+89", description: "Huruf latin kapital Y" },
  { code: 90, char: "Z", name: "Latin Capital Z", category: "uppercase", bin: "01011010", hex: "5A", oct: "132", altCode: "Alt+90", description: "Huruf latin kapital Z" },
  { code: 91, char: "[", name: "Left bracket", category: "symbol", bin: "01011011", hex: "5B", oct: "133", altCode: "Alt+91", description: "Kurung siku buka" },
  { code: 92, char: "\\", name: "Backslash", category: "symbol", bin: "01011100", hex: "5C", oct: "134", altCode: "Alt+92", description: "Garis miring terbalik (Backslash)" },
  { code: 93, char: "]", name: "Right bracket", category: "symbol", bin: "01011101", hex: "5D", oct: "135", altCode: "Alt+93", description: "Kurung siku tutup" },
  { code: 94, char: "^", name: "Caret / Circumflex", category: "symbol", bin: "01011110", hex: "5E", oct: "136", altCode: "Alt+94", description: "Tanda sisip (Caret)" },
  { code: 95, char: "_", name: "Underscore", category: "symbol", bin: "01011111", hex: "5F", oct: "137", altCode: "Alt+95", description: "Garis bawah (Underscore)" },
  { code: 96, char: "`", name: "Grave accent / Backtick", category: "symbol", bin: "01100000", hex: "60", oct: "140", altCode: "Alt+96", description: "Backtick / aksen grafis" },
  { code: 97, char: "a", name: "Latin Small a", category: "lowercase", bin: "01100001", hex: "61", oct: "141", altCode: "Alt+97", description: "Huruf latin kecil a" },
  { code: 98, char: "b", name: "Latin Small b", category: "lowercase", bin: "01100010", hex: "62", oct: "142", altCode: "Alt+98", description: "Huruf latin kecil b" },
  { code: 99, char: "c", name: "Latin Small c", category: "lowercase", bin: "01100011", hex: "63", oct: "143", altCode: "Alt+99", description: "Huruf latin kecil c" },
  { code: 100, char: "d", name: "Latin Small d", category: "lowercase", bin: "01100100", hex: "64", oct: "144", altCode: "Alt+100", description: "Huruf latin kecil d" },
  { code: 101, char: "e", name: "Latin Small e", category: "lowercase", bin: "01100101", hex: "65", oct: "145", altCode: "Alt+101", description: "Huruf latin kecil e" },
  { code: 102, char: "f", name: "Latin Small f", category: "lowercase", bin: "01100110", hex: "66", oct: "146", altCode: "Alt+102", description: "Huruf latin kecil f" },
  { code: 103, char: "g", name: "Latin Small g", category: "lowercase", bin: "01100111", hex: "67", oct: "147", altCode: "Alt+103", description: "Huruf latin kecil g" },
  { code: 104, char: "h", name: "Latin Small h", category: "lowercase", bin: "01101000", hex: "68", oct: "150", altCode: "Alt+104", description: "Huruf latin kecil h" },
  { code: 105, char: "i", name: "Latin Small i", category: "lowercase", bin: "01101001", hex: "69", oct: "151", altCode: "Alt+105", description: "Huruf latin kecil i" },
  { code: 106, char: "j", name: "Latin Small j", category: "lowercase", bin: "01101010", hex: "6A", oct: "152", altCode: "Alt+106", description: "Huruf latin kecil j" },
  { code: 107, char: "k", name: "Latin Small k", category: "lowercase", bin: "01101011", hex: "6B", oct: "153", altCode: "Alt+107", description: "Huruf latin kecil k" },
  { code: 108, char: "l", name: "Latin Small l", category: "lowercase", bin: "01101100", hex: "6C", oct: "154", altCode: "Alt+108", description: "Huruf latin kecil l" },
  { code: 109, char: "m", name: "Latin Small m", category: "lowercase", bin: "01101101", hex: "6D", oct: "155", altCode: "Alt+109", description: "Huruf latin kecil m" },
  { code: 110, char: "n", name: "Latin Small n", category: "lowercase", bin: "01101110", hex: "6E", oct: "156", altCode: "Alt+110", description: "Huruf latin kecil n" },
  { code: 111, char: "o", name: "Latin Small o", category: "lowercase", bin: "01101111", hex: "6F", oct: "157", altCode: "Alt+111", description: "Huruf latin kecil o" },
  { code: 112, char: "p", name: "Latin Small p", category: "lowercase", bin: "01110000", hex: "70", oct: "160", altCode: "Alt+112", description: "Huruf latin kecil p" },
  { code: 113, char: "q", name: "Latin Small q", category: "lowercase", bin: "01110001", hex: "71", oct: "161", altCode: "Alt+113", description: "Huruf latin kecil q" },
  { code: 114, char: "r", name: "Latin Small r", category: "lowercase", bin: "01110010", hex: "72", oct: "162", altCode: "Alt+114", description: "Huruf latin kecil r" },
  { code: 115, char: "s", name: "Latin Small s", category: "lowercase", bin: "01110011", hex: "73", oct: "163", altCode: "Alt+115", description: "Huruf latin kecil s" },
  { code: 116, char: "t", name: "Latin Small t", category: "lowercase", bin: "01110100", hex: "74", oct: "164", altCode: "Alt+116", description: "Huruf latin kecil t" },
  { code: 117, char: "u", name: "Latin Small u", category: "lowercase", bin: "01110101", hex: "75", oct: "165", altCode: "Alt+117", description: "Huruf latin kecil u" },
  { code: 118, char: "v", name: "Latin Small v", category: "lowercase", bin: "01110110", hex: "76", oct: "166", altCode: "Alt+118", description: "Huruf latin kecil v" },
  { code: 119, char: "w", name: "Latin Small w", category: "lowercase", bin: "01110111", hex: "77", oct: "167", altCode: "Alt+119", description: "Huruf latin kecil w" },
  { code: 120, char: "x", name: "Latin Small x", category: "lowercase", bin: "01111000", hex: "78", oct: "170", altCode: "Alt+120", description: "Huruf latin kecil x" },
  { code: 121, char: "y", name: "Latin Small y", category: "lowercase", bin: "01111001", hex: "79", oct: "171", altCode: "Alt+121", description: "Huruf latin kecil y" },
  { code: 122, char: "z", name: "Latin Small z", category: "lowercase", bin: "01111010", hex: "7A", oct: "172", altCode: "Alt+122", description: "Huruf latin kecil z" },
  { code: 123, char: "{", name: "Left curly brace", category: "symbol", bin: "01111011", hex: "7B", oct: "173", altCode: "Alt+123", description: "Kurung kurawal buka" },
  { code: 124, char: "|", name: "Vertical bar / Pipe", category: "symbol", bin: "01111100", hex: "7C", oct: "174", altCode: "Alt+124", description: "Garis vertikal / Pipe (Contoh Alt+124 di slide)" },
  { code: 125, char: "}", name: "Right curly brace", category: "symbol", bin: "01111101", hex: "7D", oct: "175", altCode: "Alt+125", description: "Kurung kurawal tutup" },
  { code: 126, char: "~", name: "Tilde", category: "symbol", bin: "01111110", hex: "7E", oct: "176", altCode: "Alt+126", description: "Tanda tilde (~)" },
  { code: 127, char: "DEL", name: "Delete", category: "control", bin: "01111111", hex: "7F", oct: "177", altCode: "Alt+127", description: "Karakter hapus (Delete)" },
  // Extended ASCII samples (128 - 255)
  { code: 128, char: "Ç", name: "Latin C with cedilla", category: "extended", bin: "10000000", hex: "80", oct: "200", altCode: "Alt+128", description: "Huruf C dengan cedilla" },
  { code: 129, char: "ü", name: "Latin u with diaeresis", category: "extended", bin: "10000001", hex: "81", oct: "201", altCode: "Alt+129", description: "Huruf u dengan umlaut" },
  { code: 130, char: "é", name: "Latin e with acute", category: "extended", bin: "10000010", hex: "82", oct: "202", altCode: "Alt+130", description: "Huruf e dengan aksen tirus" },
  { code: 156, char: "£", name: "Pound sign", category: "extended", bin: "10011100", hex: "9C", oct: "234", altCode: "Alt+156", description: "Simbol mata uang Poundsterling" },
  { code: 165, char: "¥", name: "Yen sign", category: "extended", bin: "10100101", hex: "A5", oct: "245", altCode: "Alt+165", description: "Simbol mata uang Yen" },
  { code: 171, char: "½", name: "Vulgar fraction one half", category: "extended", bin: "10101011", hex: "AB", oct: "253", altCode: "Alt+171", description: "Pecahan setengah (1/2)" },
  { code: 172, char: "¼", name: "Vulgar fraction one quarter", category: "extended", bin: "10101100", hex: "AC", oct: "254", altCode: "Alt+172", description: "Pecahan seperempat (1/4)" },
  { code: 241, char: "±", name: "Plus-minus sign", category: "extended", bin: "11110001", hex: "F1", oct: "361", altCode: "Alt+241", description: "Simbol plus-minus (±)" },
  { code: 246, char: "÷", name: "Division sign", category: "extended", bin: "11110110", hex: "F6", oct: "366", altCode: "Alt+246", description: "Simbol pembagian (÷)" },
  { code: 248, char: "°", name: "Degree sign", category: "extended", bin: "11111000", hex: "F8", oct: "370", altCode: "Alt+248", description: "Simbol derajat (°)" },
  { code: 253, char: "²", name: "Superscript two", category: "extended", bin: "11111101", hex: "FD", oct: "375", altCode: "Alt+253", description: "Pangkat dua (²)" },
  { code: 255, char: "NBSP", name: "Non-breaking space", category: "extended", bin: "11111111", hex: "FF", oct: "377", altCode: "Alt+255", description: "Non-breaking space / Byte 255 (11111111₂)" },
];

export interface AsciiCharBreakdown {
  index: number;
  char: string;
  displayChar: string;
  dec: number;
  bin: string;
  hex: string;
  oct: string;
  altCode: string;
  formula: string;
}

export interface AsciiTextResult {
  text: string;
  totalChars: number;
  characters: AsciiCharBreakdown[];
  decimalString: string;
  binaryString: string;
  hexString: string;
  octalString: string;
  altCodeList: string[];
}

export function convertTextToAscii(text: string): AsciiTextResult {
  const characters: AsciiCharBreakdown[] = [];
  const decimals: number[] = [];
  const binaries: string[] = [];
  const hexes: string[] = [];
  const octals: string[] = [];
  const altCodes: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = text.charCodeAt(i) % 256; // Standard 8-bit wrap
    const bin = code.toString(2).padStart(8, "0");
    const hex = code.toString(16).toUpperCase().padStart(2, "0");
    const oct = code.toString(8).padStart(3, "0");
    const altCode = `Alt+${code}`;
    const displayChar = char === " " ? "␣ (Spasi)" : char === "\n" ? "⏎ (Enter)" : char;

    const formula = `${char} = ${code}₁₀ = ${bin}₂`;

    characters.push({
      index: i + 1,
      char,
      displayChar,
      dec: code,
      bin,
      hex,
      oct,
      altCode,
      formula,
    });

    decimals.push(code);
    binaries.push(bin);
    hexes.push(hex);
    octals.push(oct);
    altCodes.push(altCode);
  }

  return {
    text,
    totalChars: text.length,
    characters,
    decimalString: decimals.join(" "),
    binaryString: binaries.join(" "),
    hexString: hexes.join(" "),
    octalString: octals.join(" "),
    altCodeList: altCodes,
  };
}

export function convertAsciiCodeToText(input: string, format: "dec" | "bin" | "hex" = "dec"): string {
  const clean = input.trim();
  if (!clean) return "";

  if (format === "dec") {
    const tokens = clean.split(/[\s,]+/);
    return tokens
      .map((t) => {
        const num = parseInt(t, 10);
        return !isNaN(num) && num >= 0 && num <= 255 ? String.fromCharCode(num) : "";
      })
      .join("");
  } else if (format === "bin") {
    // If contiguous binary string of 8-bit multiples or space separated
    let tokens = clean.split(/[\s,]+/);
    if (tokens.length === 1 && tokens[0].length >= 8 && /^[01]+$/.test(tokens[0])) {
      tokens = tokens[0].match(/.{1,8}/g) || [];
    }
    return tokens
      .map((t) => {
        if (/^[01]{1,8}$/.test(t)) {
          const num = parseInt(t, 2);
          return String.fromCharCode(num);
        }
        return "";
      })
      .join("");
  } else if (format === "hex") {
    let tokens = clean.replace(/0x/gi, "").split(/[\s,]+/);
    if (tokens.length === 1 && tokens[0].length >= 2 && /^[0-9A-Fa-f]+$/.test(tokens[0])) {
      tokens = tokens[0].match(/.{1,2}/g) || [];
    }
    return tokens
      .map((t) => {
        if (/^[0-9A-Fa-f]{1,2}$/.test(t)) {
          const num = parseInt(t, 16);
          return String.fromCharCode(num);
        }
        return "";
      })
      .join("");
  }

  return "";
}

// ============================================================================
// 2. BCD (BINARY CODED DECIMAL) DATA & UTILITIES
// ============================================================================

export const BCD_DIGIT_MAP: Record<string, string> = {
  "0": "0000",
  "1": "0001",
  "2": "0010",
  "3": "0011",
  "4": "0100",
  "5": "0101",
  "6": "0110",
  "7": "0111",
  "8": "1000",
  "9": "1001",
};

export const BCD_BITS_TO_DIGIT: Record<string, string> = {
  "0000": "0",
  "0001": "1",
  "0010": "2",
  "0011": "3",
  "0100": "4",
  "0101": "5",
  "0110": "6",
  "0111": "7",
  "1000": "8",
  "1001": "9",
};

export interface BcdDigitBreakdown {
  position: number;
  digit: string;
  digitDecimal: number;
  bcdBits: string;
  bit8: number;
  bit4: number;
  bit2: number;
  bit1: number;
  explanation: string;
  formula: string;
}

export interface BcdConversionResult {
  inputDecimal: string;
  isValid: boolean;
  errorMessage?: string;
  digits: BcdDigitBreakdown[];
  bcdFormatted: string;
  bcdRaw: string;
  totalBcdBits: number;
  pureBinary: string;
  totalPureBinaryBits: number;
  bitsRatioExplanation: string;
}

export function convertDecimalToBcd(decInput: string): BcdConversionResult {
  const clean = decInput.trim().replace(/\D/g, "");
  if (!clean) {
    return {
      inputDecimal: decInput,
      isValid: false,
      errorMessage: "Masukkan bilangan desimal bulat non-negatif (0-9)",
      digits: [],
      bcdFormatted: "",
      bcdRaw: "",
      totalBcdBits: 0,
      pureBinary: "",
      totalPureBinaryBits: 0,
      bitsRatioExplanation: "",
    };
  }

  const digits: BcdDigitBreakdown[] = [];
  const bcdChunks: string[] = [];

  for (let i = 0; i < clean.length; i++) {
    const digitChar = clean[i];
    const num = parseInt(digitChar, 10);
    const bcd = BCD_DIGIT_MAP[digitChar] || "0000";
    const bit8 = parseInt(bcd[0], 10);
    const bit4 = parseInt(bcd[1], 10);
    const bit2 = parseInt(bcd[2], 10);
    const bit1 = parseInt(bcd[3], 10);

    const explanation = `Digit ${digitChar}₁₀ = (${bit8}×8 + ${bit4}×4 + ${bit2}×2 + ${bit1}×1) = ${bcd} BCD`;
    const formula = `${digitChar}₁₀ —–> ${bcd} BCD`;

    digits.push({
      position: i + 1,
      digit: digitChar,
      digitDecimal: num,
      bcdBits: bcd,
      bit8,
      bit4,
      bit2,
      bit1,
      explanation,
      formula,
    });

    bcdChunks.push(bcd);
  }

  const bcdFormatted = bcdChunks.join(" ") + " BCD";
  const bcdRaw = bcdChunks.join("");
  const totalBcdBits = bcdRaw.length;

  let pureBinary = "0";
  try {
    const big = BigInt(clean);
    pureBinary = big.toString(2);
  } catch {
    pureBinary = parseInt(clean, 10).toString(2);
  }

  const totalPureBinaryBits = pureBinary.length;
  const bitsRatioExplanation = `Bilangan ${clean}₁₀ membutuhkan ${totalBcdBits} bit dalam BCD (${clean.length} digit × 4 bit) vs ${totalPureBinaryBits} bit dalam Biner Murni (${pureBinary}₂). BCD mengorbankan kepadatan bit demi kemudahan konversi per-digit oleh manusia dan perangkat tampilan 7-segmen.`;

  return {
    inputDecimal: clean,
    isValid: true,
    digits,
    bcdFormatted,
    bcdRaw,
    totalBcdBits,
    pureBinary,
    totalPureBinaryBits,
    bitsRatioExplanation,
  };
}

export interface BcdToDecimalChunk {
  chunkIndex: number;
  bits: string;
  numericVal: number;
  digit: string;
  isValid: boolean;
  error?: string;
  formula: string;
}

export interface BcdToDecimalResult {
  inputBcd: string;
  isValid: boolean;
  errorMessage?: string;
  chunks: BcdToDecimalChunk[];
  decimalResult: string;
}

export function convertBcdToDecimal(bcdInput: string): BcdToDecimalResult {
  const clean = bcdInput.replace(/[^01]/g, "");
  if (!clean) {
    return {
      inputBcd: bcdInput,
      isValid: false,
      errorMessage: "Masukkan bit biner (0 dan 1) untuk BCD",
      chunks: [],
      decimalResult: "",
    };
  }

  // Pad to multiple of 4 from the left
  const padLen = (4 - (clean.length % 4)) % 4;
  const padded = "0".repeat(padLen) + clean;

  const chunks: BcdToDecimalChunk[] = [];
  const decimalDigits: string[] = [];
  let allValid = true;

  for (let i = 0; i < padded.length; i += 4) {
    const chunk = padded.slice(i, i + 4);
    const val = parseInt(chunk, 2);
    const valid = val <= 9;
    if (!valid) allValid = false;

    const digit = valid ? String(val) : "?";
    const error = valid
      ? undefined
      : `Nilai bit ${chunk}₂ = ${val}₁₀ (> 9). Bukan digit BCD 8421 valid (hanya 0000 s/d 1001)!`;

    const formula = valid
      ? `${chunk} BCD = (${chunk[0]}×8 + ${chunk[1]}×4 + ${chunk[2]}×2 + ${chunk[3]}×1) = ${val}₁₀`
      : `${chunk} BCD = ${val}₁₀ (INVALID / Ilegal dalam BCD)`;

    chunks.push({
      chunkIndex: Math.floor(i / 4) + 1,
      bits: chunk,
      numericVal: val,
      digit,
      isValid: valid,
      error,
      formula,
    });

    if (valid) decimalDigits.push(digit);
  }

  const decimalResult = allValid ? decimalDigits.join("") : "Invalid BCD";

  return {
    inputBcd: clean,
    isValid: allValid,
    errorMessage: allValid ? undefined : "Ditemukan kelompok 4-bit yang bernilai > 9 (tidak valid dalam BCD 8421).",
    chunks,
    decimalResult,
  };
}
