type MonthSelectorProps = {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
};

function getMonthName(monthString: string) {
  const date = new Date(monthString + '-01');
  return `${date.getMonth() + 1}月`;
}

export default function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  return (
    <div className='flex items-center justify-center gap-2 mb-4'>
      {[-2, -1, 0, 1, 2].map((offset) => {
        const date = new Date();
        date.setMonth(date.getMonth() + offset);
        const monthString = date.toISOString().slice(0, 7);
        const isSelected = monthString === selectedMonth;
        
        return (
          <button
            key={monthString}
            onClick={() => onMonthChange(monthString)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
              isSelected 
                ? 'bg-purple-500 text-white' 
                : 'text-black hover:bg-gray-100'
            }`}
          >
            {getMonthName(monthString)}
          </button>
        );
      })}
    </div>
  );
}