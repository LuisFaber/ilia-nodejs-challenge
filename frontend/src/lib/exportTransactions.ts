import type { TransactionItemData } from "@/components/TransactionItem";

export type ExportLocale = "en" | "pt-BR" | "es";

const LOCALE_MAP: Record<ExportLocale, string> = {
  en: "en-US",
  "pt-BR": "pt-BR",
  es: "es",
};

export interface ExportOptions {
  columnDate: string;
  columnDescription: string;
  columnType: string;
  columnAmount: string;
  sheetName: string;
  fileNameBase: string;
  locale: ExportLocale;
}

const DEFAULT_OPTIONS: ExportOptions = {
  columnDate: "Date",
  columnDescription: "Description",
  columnType: "Type",
  columnAmount: "Amount",
  sheetName: "Transactions",
  fileNameBase: "walletx-transactions",
  locale: "en",
};

function formatValue(amount: number, locale: ExportLocale): string {
  const localeTag = LOCALE_MAP[locale];
  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDateForExport(createdAt: string | undefined, locale: ExportLocale): string {
  if (!createdAt) return "";
  const localeTag = LOCALE_MAP[locale];
  return new Date(createdAt).toLocaleDateString(localeTag, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function escapeCSVCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function getDateSuffix(): string {
  return new Date().toISOString().slice(0, 10);
}

export function exportToCSV(
  transactions: TransactionItemData[],
  options: Partial<ExportOptions> = {}
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const headers = [opts.columnDate, opts.columnDescription, opts.columnType, opts.columnAmount];
  const rows: string[][] = [headers];
  for (const t of transactions) {
    rows.push([
      formatDateForExport(t.createdAt, opts.locale),
      t.title,
      t.category,
      formatValue(t.amount, opts.locale),
    ]);
  }
  const csv = rows.map((row) => row.map(escapeCSVCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${opts.fileNameBase}-${getDateSuffix()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportToXLSX(
  transactions: TransactionItemData[],
  options: Partial<ExportOptions> = {}
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const XLSX = await import("xlsx");
  const headers = [opts.columnDate, opts.columnDescription, opts.columnType, opts.columnAmount];
  const rows: (string | number)[][] = [headers];
  for (const t of transactions) {
    rows.push([
      formatDateForExport(t.createdAt, opts.locale),
      t.title,
      t.category,
      t.amount,
    ]);
  }
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, opts.sheetName);
  XLSX.writeFile(wb, `${opts.fileNameBase}-${getDateSuffix()}.xlsx`);
}
