import { getMonthName } from "../utils";
import { useState } from "react";

type MonthSelectorProps = {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
};

export default function MonthSelector({
  selectedMonth,
  onMonthChange,
}: MonthSelectorProps) {
  const [currentYear, setCurrentYear] = useState(() => {
    return parseInt(selectedMonth.split("-")[0]) || new Date().getFullYear();
  });

  const months = Array.from({ length: 12 }, (_, i) => `${currentYear}-${(i + 1).toString().padStart(2, '0')}`);
  const currentDate = new Date();
  const maxYear = currentDate.getFullYear() + 5; //今の年から5年先まで選択可
  const minYear = 2020; 

  const handleYearChange = (delta: number) => {
    const newYear = currentYear + delta;
    if (newYear >= minYear && newYear <= maxYear) {
      setCurrentYear(newYear);
    }
  };

  return (
    <div className="mb-16">
      {/* 年選択 */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <button
          onClick={() => handleYearChange(-1)}
          disabled={currentYear <= minYear}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        <span className="text-lg font-semibold min-w-[60px] text-center">
          {currentYear}
        </span>
        <button
          onClick={() => handleYearChange(1)}
          disabled={currentYear >= maxYear}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>

      {/* 月選択 */}
      {/* 横スクロール、スクロールバー邪魔なので削除 */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4 min-w-max">
          {months.map((monthString) => {
            const isSelected = monthString === selectedMonth;

            return (
              <button
                key={monthString}
                onClick={() => onMonthChange(monthString)}
                className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
                  isSelected
                    ? "bg-purple-500 text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                {getMonthName(monthString)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
