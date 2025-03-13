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

export const formatCurrency = (
  amount: number,
  type_price: TypePrice = TypePrice.SUM,
) => {
  const currency = type_price === TypePrice.USD ? "USD" : "UZS";
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  }).format(amount);
};

export const getUzbekMonthName = (dateString: string) => {
  const uzbekMonths = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];
  const monthNumber = parseInt(dateString.split("-")[1], 10);
  return uzbekMonths[monthNumber - 1];
};

export const getUzbekDayMonth = (dateString: string) => {
  const uzbekMonths = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  const [year, month, day] = dateString.split("-");
  const monthNumber = parseInt(month, 10);
  const monthName = uzbekMonths[monthNumber - 1];

  return `${parseInt(day, 10)}-${monthName}`;
};
