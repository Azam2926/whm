import { format } from "date-fns";
import { Locale } from "date-fns";
import { uz } from "date-fns/locale/uz";

export const formatDate = (
  date: string | Date,
  formatStr: string = "dd MMMM, yyyy. HH:mm",
  locale: Locale = uz
): string => {
  if (!date) return "";
  try {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return format(parsedDate, formatStr, { locale });
  } catch (error) {
    console.error("Vaqtni formatlashda xatolik:", error);
    return "";
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
