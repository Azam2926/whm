import { format, Locale } from "date-fns";
import { uz } from "date-fns/locale/uz";
import { TypePrice } from "@/lib/enums";

export const formatDate = (
  date: string | Date,
  formatStr: string = "dd MMMM, yyyy. HH:mm",
  locale: Locale = uz,
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

export const formatCurrency = (amount: number, type_price: TypePrice) => {
  const format = type_price === TypePrice.USD ? "usd-USD" : "uz-UZ";
  const currency = type_price === TypePrice.USD ? "USD" : "UZS";
  return new Intl.NumberFormat(format, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
