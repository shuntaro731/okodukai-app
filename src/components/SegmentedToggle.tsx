type SegmentedToggleProps = {
  leftLabel: string;
  rightLabel: string;
  value: 'left' | 'right';
  onChange: (v: 'left' | 'right') => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function SegmentedToggle({ leftLabel, rightLabel, value, onChange, leftIcon, rightIcon }: SegmentedToggleProps) {
  return (
    <div className='inline-flex items-center bg-white rounded-full p-1 shadow-md border border-gray-100'>
      <button
        onClick={() => onChange('left')}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${value === 'left' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        {leftIcon}{leftLabel}
      </button>
      <button
        onClick={() => onChange('right')}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${value === 'right' ? 'bg-blue-50 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        {rightIcon}{rightLabel}
      </button>
    </div>
  )
} 