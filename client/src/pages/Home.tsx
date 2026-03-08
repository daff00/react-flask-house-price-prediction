import { Link } from 'react-router-dom';
import { Home as HomeIcon, TrendingUp, Search, Map, AlertCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Hero Section */}
      <header className="flex flex-col items-center text-center space-y-6 pt-8 md:pt-12">
        <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 backdrop-blur-md dark:text-indigo-400">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
          Machine Learning Powered
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          Prediksi Harga <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Rumah</span>
        </h1>
        
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Platform cerdas berbasis Machine Learning untuk memprediksi harga dan menemukan spesifikasi rumah ideal di wilayah Kabupaten Tangerang.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full sm:w-auto">
          <Link
            to="/price-prediction"
            className="flex h-[55px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/50 active:scale-95"
          >
            <TrendingUp size={20} />
            Prediksi Harga
          </Link>
          <Link
            to="/specs-prediction"
            className="flex h-[55px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white/50 px-8 font-bold text-indigo-700 shadow-sm backdrop-blur-md transition-all hover:bg-white/80 dark:border-gray-700 dark:bg-gray-800/50 dark:text-indigo-300 dark:hover:bg-gray-800/80 active:scale-95"
          >
            <Search size={20} />
            Cari Spesifikasi
          </Link>
        </div>
      </header>

      {/* Features Section - Glassmorphism */}
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<TrendingUp className="text-emerald-500" size={32} />}
          title="Akurasi Model Tinggi"
          desc="Menggunakan model algoritma XGBoost yang dioptimasi untuk memberikan estimasi harga pasar seakurat mungkin."
        />
        <FeatureCard 
          icon={<Search className="text-blue-500" size={32} />}
          title="Rekomendasi Spesifikasi"
          desc="Temukan rata-rata spesifikasi rumah yang paling umum berdasarkan rentang budget dan lokasi pilihanmu."
        />
        <FeatureCard 
          icon={<Map className="text-purple-500" size={32} />}
          title="Fokus Area Tangerang"
          desc="Mendukung prediksi untuk 20+ kecamatan populer yang terdaftar di Kabupaten Tangerang."
        />
      </div>

      {/* Disclaimer Section */}
      <div className="mx-auto max-w-4xl rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400/90 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 backdrop-blur-sm">
        <AlertCircle size={24} className="shrink-0 sm:mt-0.5" />
        <div className="space-y-1 text-sm">
          <p className="font-bold uppercase tracking-wider text-[11px] opacity-80">Disclaimer</p>
          <p className="leading-relaxed">
            Platform ini menyediakan estimasi harga berdasarkan analisis Machine Learning terhadap data historis. Hasil prediksi <strong>bukan merupakan jaminan nilai aktual</strong> properti. Harga sebenarnya dapat dipengaruhi oleh fluktuasi pasar, kondisi fisik bangunan, kelengkapan legalitas, dan hasil negosiasi akhir.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: FeatureCard ---
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group flex flex-col items-center text-center rounded-3xl border border-white/20 bg-white/40 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/60 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-gray-800/20 dark:bg-gray-900/40 dark:hover:bg-gray-900/60">
      <div className="mb-5 rounded-2xl bg-gray-100 p-4 transition-colors duration-300 group-hover:bg-white group-hover:scale-110 dark:bg-gray-800 dark:group-hover:bg-gray-700">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-extrabold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  );
}