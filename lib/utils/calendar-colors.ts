export function getDayColor(day: Date, hijri?: { day: number; month: number }): string {
  if (hijri) {
    if (hijri.month === 10 && hijri.day === 1) return "text-red-500 dark:text-red-400";
    if (hijri.month === 12 && hijri.day >= 10 && hijri.day <= 13) return "text-red-500 dark:text-red-400";
  }
  if (day.getDay() === 0) return "text-red-500 dark:text-red-400";

  if (hijri) {
    if (hijri.month === 1 && (hijri.day === 9 || hijri.day === 10)) return "text-primary";
    if (hijri.month === 9) return "text-primary";
    if (hijri.month === 12 && hijri.day === 9) return "text-primary";
    if (hijri.day >= 13 && hijri.day <= 15) return "text-primary";
  }
  if (day.getDay() === 5) return "text-primary";

  return "";
}
