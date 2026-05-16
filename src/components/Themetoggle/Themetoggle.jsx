
import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";


export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        relative w-[52px] h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 shrink-0
        ${isDark
          ? "bg-gradient-to-r from-purple-700 to-purple-900 shadow-[0_0_10px_rgba(139,92,246,0.4)]"
          : "bg-gradient-to-r from-amber-200 to-orange-200 shadow-inner"
        }
      `}
    >
      {/* Sun icon (left side) */}
      <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 text-xs transition-opacity duration-300 ${isDark ? "opacity-40" : "opacity-100"}`}>
        <HiSun className="text-amber-500" />
      </span>

      {/* Moon icon (right side) */}
      <span className={`absolute right-1.5 top-1/2 -translate-y-1/2 text-xs transition-opacity duration-300 ${isDark ? "opacity-100" : "opacity-40"}`}>
        <HiMoon className="text-purple-300" />
      </span>

      {/* Thumb */}
      <span
        className={`
          absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300
          flex items-center justify-center text-xs font-bold
          ${isDark
            ? "translate-x-[26px] bg-[#1e1040] text-purple-300"
            : "translate-x-0.5 bg-white text-amber-500"
          }
        `}
      >
        {isDark ? <HiMoon size={12} /> : <HiSun size={12} />}
      </span>
    </button>
  );
}