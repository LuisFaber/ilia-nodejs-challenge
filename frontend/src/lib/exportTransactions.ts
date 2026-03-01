import type { TransactionItemData } from "@/components/TransactionItem";

const CSV_COLUMNS = ["Data", "Descrição", "Tipo", "Valor"] as const;

function formatValue(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDateForExport(createdAt?: string): string {
  if (!createdAt) return "";
  return new Date(createdAt).toLocaleDateString("pt-BR", {
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

export function exportToCSV(transactions: TransactionItemData[]): void {
  const rows: string[][] = [CSV_COLUMNS.slice()];
  for (const t of transactions) {
    rows.push([
      formatDateForExport(t.createdAt),
      t.title,
      t.category,
      formatValue(t.amount),
    ]);
  }
  const csv = rows.map((row) => row.map(escapeCSVCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `walletx-transacoes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportToXLSX(transactions: TransactionItemData[]): Promise<void> {
  const XLSX = await import("xlsx");
  const rows: (string | number)[][] = [CSV_COLUMNS.slice()];
  for (const t of transactions) {
    rows.push([
      formatDateForExport(t.createdAt),
      t.title,
      t.category,
      t.amount,
    ]);
  }
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transações");
  XLSX.writeFile(
    wb,
    `walletx-transacoes-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}
