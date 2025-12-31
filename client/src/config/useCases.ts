import { Receipt, BarChart3, History, Gem, Currency, Banknote, BanknoteArrowDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const USE_CASES = [
  {
    icon: BanknoteArrowDown,
    title: "Quick Log",
    description: `Track ${formatCurrency(45)} for Dinner at The Grill`
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Breakdown of my spending by category this month"
  },
  {
    icon: Gem,
    title: "Budget Check",
    description: `How much do I have left in my ${formatCurrency(500)} groceries budget?`
  },
  {
    icon: History,
    title: "Find Transaction",
    description: "Find my last payment for the Netflix subscription"
  }
];
