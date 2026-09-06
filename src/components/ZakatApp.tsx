import React, { useState } from "react";
import {
  Coins,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ZakatState } from "../types";

export const ZakatApp: React.FC = () => {
  const { zakatState, saveZakat } = useAuth();

  const [form, setForm] = useState<ZakatState>(() => {
    return (
      zakatState || {
        cashInHand: 2500,
        bankSavings: 8000,
        goldGrams: 0,
        goldPricePerGram: 78,
        silverGrams: 0,
        silverPricePerGram: 0.95,
        stocksShares: 1500,
        businessGoods: 0,
        moneyOwedToYou: 0,
        liabilitiesDebts: 800,
        expensesDue: 400,
        currency: "USD",
      }
    );
  });

  const [nisabStandard, setNisabStandard] = useState<"silver" | "gold">("silver");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculations
  const goldValue = form.goldGrams * form.goldPricePerGram;
  const silverValue = form.silverGrams * form.silverPricePerGram;

  const totalAssets =
    form.cashInHand +
    form.bankSavings +
    goldValue +
    silverValue +
    form.stocksShares +
    form.businessGoods +
    form.moneyOwedToYou;

  const totalLiabilities = form.liabilitiesDebts + form.expensesDue;
  const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);

  // Nisab threshold: Silver = 595 grams, Gold = 85 grams
  const silverNisabThreshold = 595 * form.silverPricePerGram;
  const goldNisabThreshold = 85 * form.goldPricePerGram;
  const activeNisabThreshold = nisabStandard === "silver" ? silverNisabThreshold : goldNisabThreshold;

  const isEligibleForZakat = netZakatableWealth >= activeNisabThreshold;
  const zakatPayable = isEligibleForZakat ? netZakatableWealth * 0.025 : 0;

  const handleSave = async () => {
    await saveZakat(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    setForm({
      cashInHand: 0,
      bankSavings: 0,
      goldGrams: 0,
      goldPricePerGram: 78,
      silverGrams: 0,
      silverPricePerGram: 0.95,
      stocksShares: 0,
      businessGoods: 0,
      moneyOwedToYou: 0,
      liabilitiesDebts: 0,
      expensesDue: 0,
      currency: "USD",
    });
  };

  return (
    <div id="zakat-calculator-mini-app" className="space-y-3.5 pb-20">
      {/* iOS Header */}
      <div className="ios-card p-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-[#1C1C1E]">
            Zakat Calculator
          </h2>
          <p className="text-[11px] text-[#8E8E93]">Calculate 2.5% on qualifying wealth above Nisab</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReset}
            className="w-8 h-8 rounded-full bg-[#767680]/10 hover:bg-[#767680]/15 active:scale-95 text-[#8E8E93] hover:text-[#1C1C1E] flex items-center justify-center transition-all cursor-pointer"
            title="Reset values"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-8 px-3 rounded-full bg-[#007A78] text-white active:scale-95 text-xs font-semibold flex items-center gap-1 shadow-xs transition-transform cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? "Saved!" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Primary Result Banner - iOS Card */}
      <div className="ios-card p-5 space-y-3 bg-gradient-to-br from-[#005F5C] to-[#003B39] text-white">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-teal-200">
            Zakat Payable (2.5%)
          </span>
          <span
            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
              isEligibleForZakat ? "bg-[#34C759] text-white" : "bg-white/20 text-white/80"
            }`}
          >
            {isEligibleForZakat ? "Nisab Met" : "Below Nisab"}
          </span>
        </div>

        <h3 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
          ${zakatPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
          <div>
            <span className="block text-[10px] text-teal-200">Net Zakatable Wealth</span>
            <span className="font-bold text-white font-mono text-sm">
              ${netZakatableWealth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-teal-200">
              Nisab ({nisabStandard})
            </span>
            <span className="font-bold text-white font-mono text-sm">
              ${activeNisabThreshold.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Nisab Standard Selector - iOS Segmented Control */}
      <div className="ios-card p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#1C1C1E]">Nisab Threshold Standard</span>
          <span className="text-[10px] text-[#8E8E93]">Silver recommended</span>
        </div>
        <div className="ios-segmented-control grid grid-cols-2 gap-0.5">
          <button
            type="button"
            onClick={() => setNisabStandard("silver")}
            className={`py-1.5 text-xs ios-segmented-button cursor-pointer ${
              nisabStandard === "silver" ? "ios-segmented-button-active" : "text-[#8E8E93]"
            }`}
          >
            Silver (595g ≈ ${silverNisabThreshold.toFixed(0)})
          </button>
          <button
            type="button"
            onClick={() => setNisabStandard("gold")}
            className={`py-1.5 text-xs ios-segmented-button cursor-pointer ${
              nisabStandard === "gold" ? "ios-segmented-button-active" : "text-[#8E8E93]"
            }`}
          >
            Gold (85g ≈ ${goldNisabThreshold.toFixed(0)})
          </button>
        </div>
      </div>

      {/* 1. Assets Inputs */}
      <div className="ios-card p-4 space-y-3">
        <h3 className="text-xs font-semibold text-[#1C1C1E]">Zakatable Assets</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div>
            <label className="block text-[#8E8E93] text-[11px] mb-1">Cash in Hand ($)</label>
            <input
              type="number"
              min="0"
              value={form.cashInHand || ""}
              onChange={(e) => setForm({ ...form, cashInHand: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-[12px] bg-[#767680]/10 border-0 font-mono text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007A78]/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-[#8E8E93] text-[11px] mb-1">Bank Savings & Deposits ($)</label>
            <input
              type="number"
              min="0"
              value={form.bankSavings || ""}
              onChange={(e) => setForm({ ...form, bankSavings: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-[12px] bg-[#767680]/10 border-0 font-mono text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007A78]/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-[#8E8E93] text-[11px] mb-1">Gold Owned (grams)</label>
            <input
              type="number"
              min="0"
              value={form.goldGrams || ""}
              onChange={(e) => setForm({ ...form, goldGrams: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-[12px] bg-[#767680]/10 border-0 font-mono text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007A78]/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-[#8E8E93] text-[11px] mb-1">Silver Owned (grams)</label>
            <input
              type="number"
              min="0"
              value={form.silverGrams || ""}
              onChange={(e) => setForm({ ...form, silverGrams: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-[12px] bg-[#767680]/10 border-0 font-mono text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007A78]/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-[#8E8E93] text-[11px] mb-1">Shares & Stock Investments ($)</label>
            <input
              type="number"
              min="0"
              value={form.stocksShares || ""}
              onChange={(e) => setForm({ ...form, stocksShares: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-[12px] bg-[#767680]/10 border-0 font-mono text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007A78]/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-[#8E8E93] text-[11px] mb-1">Business Merchandise for Sale ($)</label>
            <input
              type="number"
              min="0"
              value={form.businessGoods || ""}
              onChange={(e) => setForm({ ...form, businessGoods: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-[12px] bg-[#767680]/10 border-0 font-mono text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007A78]/30 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2. Liabilities Deductions */}
      <div className="ios-card p-4 space-y-3">
        <h3 className="text-xs font-semibold text-[#1C1C1E]">Deductible Liabilities & Debts</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div>
            <label className="block text-[#8E8E93] text-[11px] mb-1">Immediate Debts Due ($)</label>
            <input
              type="number"
              min="0"
              value={form.liabilitiesDebts || ""}
              onChange={(e) => setForm({ ...form, liabilitiesDebts: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-[12px] bg-[#767680]/10 border-0 font-mono text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007A78]/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-[#8E8E93] text-[11px] mb-1">Rent / Bills Immediately Due ($)</label>
            <input
              type="number"
              min="0"
              value={form.expensesDue || ""}
              onChange={(e) => setForm({ ...form, expensesDue: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-[12px] bg-[#767680]/10 border-0 font-mono text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007A78]/30 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
