import React, { useState } from 'react';
import axios from 'axios';
import { Home, Bed, Bath, Maximize, Zap, Layers, Car, UserCheck, Search, Loader2 } from 'lucide-react';

const kecamatanList = [
  'Balaraja', 'Cikupa', 'Cisauk', 'Curug', 'Jatiuwung', 'Jayanti', 'Kadu',
  'Kelapa Dua', 'Kosambi', 'Kresek', 'Legok', 'Mauk', 'Pagedangan',
  'Panongan', 'Pasar Kemis', 'Rajeg', 'Sepatan', 'Sindang Jaya', 'Solear',
  'Teluk Naga', 'Tigaraksa'
];

export default function PricePrediction() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    kecamatan: 'Kelapa Dua',
    kamar_tidur: 3,
    kamar_mandi: 2,
    luas_tanah: 120,
    luas_bangunan: 100,
    daya_listrik: 2200,
    jumlah_lantai: 2,
    carport: 1,
    kamar_tidur_pembantu: 0,
    kamar_mandi_pembantu: 0,
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'kecamatan' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Menghubungi Gateway Node.js
      const response = await axios.post(`${apiUrl}/api/predictions`, formData);
      setPrediction(response.data.data.predicted_price);
    } catch (error) {
      console.error("Error predicting price:", error);
      alert("Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          📊 <span className="text-blue-600 dark:text-blue-400">Prediksi</span> Harga Rumah
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Masukkan spesifikasi rumah untuk mendapatkan estimasi harga pasar.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 rounded-3xl border border-white/20 bg-white/40 p-8 shadow-xl backdrop-blur-xl transition-colors duration-300 dark:border-gray-800/20 dark:bg-gray-900/40">
            
            {/* Kecamatan - Full Width */}
            <div className="sm:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Home size={16} /> Kecamatan
              </label>
              <select
                name="kecamatan"
                value={formData.kecamatan}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white/50 p-3 outline-none ring-blue-500/20 transition-all focus:ring-4 dark:border-gray-700 dark:bg-gray-800/50"
              >
                {kecamatanList.map((kec) => (
                  <option key={kec} value={kec}>{kec}</option>
                ))}
              </select>
            </div>

            {/* Input Groups */}
            <InputField label="Kamar Tidur" name="kamar_tidur" value={formData.kamar_tidur} icon={<Bed size={16} />} onChange={handleChange} />
            <InputField label="Kamar Mandi" name="kamar_mandi" value={formData.kamar_mandi} icon={<Bath size={16} />} onChange={handleChange} />
            <InputField label="Luas Tanah (m²)" name="luas_tanah" value={formData.luas_tanah} icon={<Maximize size={16} />} onChange={handleChange} />
            <InputField label="Luas Bangunan (m²)" name="luas_bangunan" value={formData.luas_bangunan} icon={<Maximize size={16} />} onChange={handleChange} />
            <InputField label="Daya Listrik (W)" name="daya_listrik" value={formData.daya_listrik} icon={<Zap size={16} />} onChange={handleChange} />
            <InputField label="Jumlah Lantai" name="jumlah_lantai" value={formData.jumlah_lantai} icon={<Layers size={16} />} onChange={handleChange} />
            <InputField label="Carport (Mobil)" name="carport" value={formData.carport} icon={<Car size={16} />} onChange={handleChange} />
            <InputField label="KM Pembantu" name="kamar_mandi_pembantu" value={formData.kamar_mandi_pembantu} icon={<UserCheck size={16} />} onChange={handleChange} />

            <button
              type="submit"
              disabled={loading}
              className="sm:col-span-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/50 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              {loading ? 'Menghitung...' : 'Prediksi Sekarang'}
            </button>
          </div>
        </form>

        {/* Result Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-white/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-8 shadow-xl backdrop-blur-2xl dark:border-gray-800/20">
            <h2 className="text-xl font-bold mb-4">Estimasi Harga</h2>
            {prediction ? (
              <div className="animate-in zoom-in duration-500">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hasil Prediksi:</p>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  Rp {prediction.toLocaleString('id-ID')}
                </div>
                <div className="mt-6 rounded-xl bg-blue-500/10 p-4 text-xs text-blue-800 dark:text-blue-300 border border-blue-500/20">
                  ⚠️ Harga ini adalah estimasi berdasarkan model Machine Learning (XGBoost) dan dapat berbeda dengan harga pasar aktual.
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                <CalculatorIcon size={48} className="mb-4 opacity-20" />
                <p>Klik tombol prediksi untuk melihat hasil</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen Input Kecil agar kode bersih
function InputField({ label, name, value, icon, onChange }: any) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        {icon} {label}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-300 bg-white/50 p-3 outline-none ring-blue-500/20 transition-all focus:ring-4 dark:border-gray-700 dark:bg-gray-800/50"
      />
    </div>
  );
}

function CalculatorIcon({ size, className }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}