import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Banknote, Bed, Bath, Maximize, Zap, Layers, Car, Loader2, Info, AlertCircle } from 'lucide-react';

// --- HELPER FUNCTION: Mengurutkan Harga (500jt < 1M) ---
const sortPriceRanges = (ranges: string[]) => {
  if (!ranges || ranges.length === 0) return [];
  
  const parsePrice = (s: string) => {
    // Ambil angka pertama (termasuk desimal)
    const numbers = s.replace(/,/g, '').match(/(\d+\.?\d*)/);
    const value = numbers ? parseFloat(numbers[0]) : 0;
    
    // Standarisasi unit: Miliar dikali 1000 agar lebih besar dari Juta
    if (s.toLowerCase().includes('miliar')) return value * 1000;
    return value; // Untuk "Juta"
  };

  return [...ranges].sort((a, b) => parsePrice(a) - parsePrice(b));
};

interface HouseSpecs {
  kamar_tidur: number;
  kamar_mandi: number;
  luas_tanah: number;
  luas_bangunan: number;
  daya_listrik: number;
  jumlah_lantai: number;
  carport: number;
}

export default function SpecsPrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<{ kecamatan_list: string[], range_harga_list: string[] }>({
    kecamatan_list: [],
    range_harga_list: []
  });
  const [filters, setFilters] = useState({ kecamatan: '', range_harga: '' });
  const [result, setResult] = useState<HouseSpecs | null>(null);

  // --- 1. AMBIL OPSI FILTER ---
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/predictions/specs');
        console.log("Response Server:", res.data); // Debugging

        // Handle jika data dibungkus dalam res.data.data (tergantung backend kamu)
        const source = res.data.data || res.data;
        const kecamatanRaw = source.kecamatan_list || [];
        const hargaRaw = source.range_harga_list || [];

        const sortedKecamatan = [...kecamatanRaw].sort();
        const sortedHarga = sortPriceRanges(hargaRaw);

        setOptions({
          kecamatan_list: sortedKecamatan,
          range_harga_list: sortedHarga
        });

        if (sortedKecamatan.length > 0 && sortedHarga.length > 0) {
          setFilters({
            kecamatan: sortedKecamatan[0],
            range_harga: sortedHarga[0]
          });
        }
      } catch (err) {
        console.error("Gagal fetch options:", err);
        setError("Gagal mengambil data dari server. Pastikan Backend menyala.");
      }
    };
    fetchOptions();
  }, []);

  // --- 2. CARI SPESIFIKASI ---
  const handleSearch = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await axios.get('http://localhost:3000/api/predictions/specs', { params: filters });
      
      const source = res.data.data || res.data;
      if (source.recommended_specs) {
        setResult(source.recommended_specs);
      } else {
        setError("Tidak ada data rekomendasi untuk rentang harga ini.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Terjadi kesalahan saat mencari data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          🔍 Cari <span className="text-indigo-600 dark:text-indigo-400">Spesifikasi</span>
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Pilih budget dan lokasi untuk melihat spesifikasi rumah yang ideal.</p>
      </header>

      {/* Filter Section - Glassmorphism */}
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/20 bg-white/40 p-6 shadow-xl backdrop-blur-xl transition-colors duration-300 dark:border-gray-800/20 dark:bg-gray-900/40">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold opacity-70">
              <MapPin size={16} className="text-indigo-500" /> Kecamatan
            </label>
            <select
              value={filters.kecamatan}
              onChange={(e) => setFilters({ ...filters, kecamatan: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white/50 p-3 outline-none transition-all focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800/50"
            >
              {options.kecamatan_list.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold opacity-70">
              <Banknote size={16} className="text-green-500" /> Budget (IDR)
            </label>
            <select
              value={filters.range_harga}
              onChange={(e) => setFilters({ ...filters, range_harga: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white/50 p-3 outline-none transition-all focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800/50"
            >
              {options.range_harga_list.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading || options.kecamatan_list.length === 0}
              className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/50 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              Cari Spesifikasi
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-600 dark:text-red-400">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Result Grid */}
      {result && (
        <div className="mx-auto max-w-4xl animate-in zoom-in duration-500">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <SpecCard icon={<Bed className="text-blue-500" />} label="Kamar Tidur" value={result.kamar_tidur} />
            <SpecCard icon={<Bath className="text-cyan-500" />} label="Kamar Mandi" value={result.kamar_mandi} />
            <SpecCard icon={<Maximize className="text-emerald-500" />} label="L. Tanah" value={`${result.luas_tanah} m²`} />
            <SpecCard icon={<Maximize className="text-green-500" />} label="L. Bangunan" value={`${result.luas_bangunan} m²`} />
            <SpecCard icon={<Zap className="text-yellow-500" />} label="Listrik" value={`${result.daya_listrik} W`} />
            <SpecCard icon={<Layers className="text-purple-500" />} label="Lantai" value={result.jumlah_lantai} />
            <SpecCard icon={<Car className="text-orange-500" />} label="Carport" value={result.carport} />
            
            <div className="flex flex-col items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 text-center backdrop-blur-md dark:bg-indigo-500/10">
              <Info size={24} className="mb-2 text-indigo-500" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Info</p>
              <p className="text-xs font-semibold leading-tight">Spesifikasi paling umum di range ini.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: SpecCard ---
function SpecCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="group flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/40 p-6 shadow-lg backdrop-blur-md transition-all hover:translate-y-[-4px] hover:bg-white/60 dark:border-gray-800/20 dark:bg-gray-900/40 dark:hover:bg-gray-900/60">
      <div className="mb-3 rounded-full bg-gray-100 p-3 transition-colors group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-700">
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}