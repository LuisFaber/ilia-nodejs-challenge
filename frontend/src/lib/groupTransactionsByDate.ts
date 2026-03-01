import type { TransactionItemData } from "@/components/TransactionItem";

export type DateGroupLabel = "today" | "yesterday" | "thisMonth" | string;

export interface GroupedTransactions {
  label: DateGroupLabel;
  items: TransactionItemData[];
}

function getStartOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function getMonthYearLabel(d: Date, locale: string): string {
  const localeMap: Record<string, string> = {
    en: "en-US",
    "pt-BR": "pt-BR",
    es: "es",
  };
  const resolved = localeMap[locale] ?? "en-US";
  return d.toLocaleDateString(resolved, { month: "long", year: "numeric" });
}

export function groupTransactionsByDate(
  transactions: TransactionItemData[],
  locale = "en"
): GroupedTransactions[] {
  const now = new Date();
  const startToday = getStartOfDay(now);
  const startYesterday = new Date(startToday);
  startYesterday.setDate(startYesterday.getDate() - 1);

  const groups: Map<DateGroupLabel, TransactionItemData[]> = new Map([
    ["today", []],
    ["yesterday", []],
    ["thisMonth", []],
  ]);

  for (const t of transactions) {
    const createdAt = t.createdAt ? new Date(t.createdAt) : new Date(0);
    if (createdAt >= startToday) {
      groups.get("today")!.push(t);
    } else if (createdAt >= startYesterday && createdAt < startToday) {
      groups.get("yesterday")!.push(t);
    } else if (isSameMonth(createdAt, now)) {
      groups.get("thisMonth")!.push(t);
    } else {
      const label = getMonthYearLabel(createdAt, locale);
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label)!.push(t);
    }
  }

  const order: DateGroupLabel[] = ["today", "yesterday", "thisMonth"];
  const result: GroupedTransactions[] = [];
  for (const label of order) {
    const items = groups.get(label);
    if (items && items.length > 0) result.push({ label, items });
  }
  const otherLabels = Array.from(groups.keys()).filter(
    (k) => !order.includes(k)
  );
  for (const label of otherLabels) {
    const items = groups.get(label)!;
    if (items.length > 0) result.push({ label, items });
  }
  return result;
}
