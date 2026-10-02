import BinaryConverter from "@/components/BinaryConverter";
import AsciiConverter from "@/components/AsciiConverter";
import BcdConverter from "@/components/BcdConverter";
import ToolsTambahan from "@/components/ToolsTambahan";

const Index = () => {
  return (
    <div className="app-bg min-h-screen py-5 sm:py-6 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Konversi Sistem Bilangan & Subnetting Jaringan Banner */}
        <div className="w-full flex items-center justify-center">
          {/* Desktop Banner */}
          <img
            src="/images/bgdekstopkonversi.png"
            alt="Banner Konversi Sistem Bilangan & Subnetting Jaringan"
            className="hidden md:block w-full h-auto object-contain"
          />

          {/* Mobile / Tablet Banner */}
          <img
            src="/images/bgmobilekonversi.png"
            alt="Banner Konversi Sistem Bilangan & Subnetting Jaringan"
            className="block md:hidden w-full h-auto max-w-[440px] object-contain mx-auto"
          />
        </div>

        {/* 1. Kalkulator Sistem Bilangan (12 Metode Konversi) */}
        <div>
          <BinaryConverter />
        </div>

        {/* 2. Kalkulator ASCII (8-Bit & Decoder) - Hidden by default (Collapsible) */}
        <div>
          <AsciiConverter />
        </div>

        {/* 3. Kalkulator BCD (Binary Coded Decimal) - Hidden by default (Collapsible) */}
        <div>
          <BcdConverter />
        </div>

        {/* 4. Tools Tambahan Subnetting & Peralatan Jaringan - Hidden by default (Collapsible) */}
        <div>
          <ToolsTambahan />
        </div>
      </div>
    </div>
  );
};

export default Index;
