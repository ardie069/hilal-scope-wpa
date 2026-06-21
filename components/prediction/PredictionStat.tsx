interface Props {
  label: string;
  value: string;
  isPrimary?: boolean;
  isDanger?: boolean;
  isWarning?: boolean;
}

export default function PredictionStat({ label, value, isPrimary = false, isDanger = false, isWarning = false }: Props) {
  let textColor = "text-gray-900 dark:text-white";
  if (isDanger) textColor = "text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.2)]";
  else if (isWarning) textColor = "text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]";
  else if (isPrimary) textColor = "text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]";

  let markerColor = "bg-gray-200 dark:bg-white/20";
  if (isDanger) markerColor = "bg-rose-500";
  else if (isWarning) markerColor = "bg-amber-500";
  else if (isPrimary) markerColor = "bg-primary";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-1 h-3 rounded-full ${markerColor}`} />
        <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.2em] m-0">{label}</p>
      </div>
      <p className={`text-xl sm:text-2xl font-black tabular-nums tracking-tighter transition-colors ${textColor}`}>
        {value}
      </p>
    </div>
  );
}
