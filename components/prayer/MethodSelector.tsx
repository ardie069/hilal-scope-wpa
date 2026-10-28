import { formatCoordinates } from "@/lib/utils/maps";

interface MethodSelectorProps {
  methods: { id: string; name: string }[];
  method: string;
  onChange: (method: string) => void;
  data: any;
}

export default function MethodSelector({ methods, method, onChange, data }: MethodSelectorProps) {
  return (
    <div className="rounded-2xl p-6 sm:p-8 shadow-card border transition-all duration-500 bg-card-light dark:bg-card-dark border-gray-100 dark:border-gray-800">
      <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6">
        Pengaturan Metode
      </h3>
      <div className="flex flex-col gap-3">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`px-4 py-3 rounded-xl border text-left text-sm font-bold transition-all ${
              method === m.id
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-transparent text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50"
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {data && (
        <>
          <div className="w-full border-t border-gray-100 dark:border-gray-800 my-6 border-dashed" />
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">
              Lokasi Anda
            </h3>
            <div className="flex flex-col gap-4">
              <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/50 dark:bg-white/5">
                <span className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Koordinat
                </span>
                <span className="font-mono text-xs font-bold text-gray-900 dark:text-white block">
                  {formatCoordinates(data.location.latitude, data.location.longitude)}
                </span>
              </div>
              <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/50 dark:bg-white/5">
                <span className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Zona Waktu
                </span>
                <span className="font-bold text-xs text-gray-900 dark:text-white block">
                  {data.location.timezone}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
