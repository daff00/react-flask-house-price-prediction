// Dummy
export default function Home() {
  return (
    <div className="p-8 text-gray-800 dark:text-gray-200">
      <h1 className="mb-4 text-3xl font-bold">Halaman Home & Disclaimer</h1>
      <div className="space-y-4">
        {[...Array(20)].map((_, i) => (
          <p key={i} className="rounded-lg bg-white/50 p-4 shadow-sm transition-colors duration-300 dark:bg-gray-800/50">
            Ini adalah paragraf contoh ke-{i + 1} untuk mengetes efek blur pada navbar. Coba scroll halaman ini ke bawah, lalu perhatikan bagaimana tulisan ini lewat di balik navbar!
          </p>
        ))}
      </div>
    </div>
  );
}