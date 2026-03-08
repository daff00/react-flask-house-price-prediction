import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Moon, Sun, Home, Calculator, Search } from "lucide-react";

export default function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  // Logika untuk mendeteksi dan menerapkan dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    {
      name: "Prediksi Harga",
      path: "/predict",
      icon: <Calculator size={18} />,
    },
    { name: "Cari Spesifikasi", path: "/specs", icon: <Search size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900 transition-colors duration-300 dark:from-gray-950 dark:to-gray-900 dark:text-gray-100">
      {/* Navbar dengan efek Glassmorphism */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/60 backdrop-blur-md transition-colors duration-300 dark:border-gray-800/50 dark:bg-gray-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo / Title */}
            <div className="flex-shrink-0 font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                Tangerang
              </span>
              <span>Homes</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden space-x-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
              aria-label="Toggle Dark Mode"
            >
              {/* Ikon Matahari - Muncul saat Light Mode */}
              <Sun
                size={20}
                className={`absolute transition-all duration-500 ${
                  isDarkMode
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100 text-yellow-500"
                }`}
                strokeWidth={2.5}
              />

              {/* Ikon Bulan - Muncul saat Dark Mode */}
              <Moon
                size={20}
                className={`absolute transition-all duration-500 ${
                  isDarkMode
                    ? "rotate-0 scale-100 opacity-100 text-blue-400"
                    : "-rotate-90 scale-0 opacity-0"
                }`}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Konten Halaman akan dirender di sini */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
