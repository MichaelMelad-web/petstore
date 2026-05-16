import aboutDogs from "../../assets/images/AboutHeader/bg1.webp";
import { useTheme } from "../../context/ThemeContext";

export default function AboutHeader() {
  const { isDark } = useTheme();

  return (
    <div
      className="w-full relative overflow-hidden pt-40 py-10 transition-colors duration-300"
      style={{
        backgroundColor: isDark ? "#1e1a2e" : "#d9eaf3",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <h1
          className="text-4xl md:text-5xl font-bold transition-colors duration-300"
          style={{ color: isDark ? "#ffffff" : "#111827" }}
        >
          About Us
        </h1>
        <p
          className="mt-3 text-sm md:text-base transition-colors duration-300"
          style={{ color: isDark ? "#d1d5db" : "#374151" }}
        >
          <span className="font-semibold">HOME</span>
          <span
            className="font-semibold ml-1"
            style={{ color: isDark ? "#a78bfa" : "#7c3aed" }}
          >
            ABOUT US
          </span>
        </p>
      </div>

      {/* Dogs image — في dark mode بنخلي الصورة تتمازج مع الخلفية */}
      <div className="absolute bottom-0 right-0 w-[800px] sm:w-[1000px] md:w-[1200px] lg:w-[1400px] xl:w-[1800px]">
        <img
          src={aboutDogs}
          alt="Dogs"
          className="w-full h-full object-contain pointer-events-none select-none transition-all duration-300"
          style={{
            // mix-blend-multiply بيشيل الخلفية الفاتحة ويخلي الكلاب بس تبان
            mixBlendMode: isDark ? "luminosity" : "normal",
            opacity: isDark ? 0.85 : 1,
            filter: isDark ? "brightness(0.8) contrast(1.1)" : "none",
          }}
        />
      </div>
    </div>
  );
}