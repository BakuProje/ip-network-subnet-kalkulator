import BinaryConverter from "@/components/BinaryConverter";
import ToolsTambahan from "@/components/ToolsTambahan";

const Index = () => {
  return (
    <div className="app-bg min-h-screen py-5 sm:py-6 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Top Header Card */}
        <header className="neo-box bg-white p-3.5 sm:p-4 flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 sm:gap-4 w-full">
            <div className="h-11 sm:h-12 w-11 sm:w-12 rounded-xl border-2 border-slate-900 shadow-[2.5px_2.5px_0px_0px_#0f172a] overflow-hidden bg-white p-1 flex items-center justify-center shrink-0">
              <img
                src="/images/logo.png"
                alt="KALNET Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight leading-tight uppercase">
                KALKULATOR SISTEM BILANGAN &amp; IP SUBNET
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-600 font-semibold">
                Konversi Sistem Bilangan &amp; Peralatan Jaringan IPv4
              </p>
            </div>
          </div>
        </header>

        {/* Konversi Sistem Bilangan & Subnetting Jaringan Banner (Gambar Langsung Tanpa Kotak Luar) */}
        <div className="w-full flex items-center justify-center">
          {/* Desktop Banner */}
          <img
            src="/images/bgdekstopkonversi.png"
            alt="Banner Konversi Sistem Bilangan & Subnetting Jaringan"
            className="hidden md:block w-full h-auto object-contain block"
          />

          {/* Mobile / Tablet Banner */}
          <img
            src="/images/bgmobilekonversi.png"
            alt="Banner Konversi Sistem Bilangan & Subnetting Jaringan"
            className="block md:hidden w-full h-auto max-w-[440px] object-contain mx-auto block"
          />
        </div>

        {/* 1. Kalkulator Sistem Bilangan (Konversi & Cara Kerja) */}
        <div>
          <BinaryConverter />
        </div>

        {/* 2. Tools Tambahan (Termasuk MASUKKAN ALAMAT IP & Peralatan Jaringan) */}
        <div>
          <ToolsTambahan />
        </div>
      </div>
    </div>
  );
};

export default Index;
