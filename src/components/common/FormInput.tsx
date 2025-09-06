type FormInputProps = {
  type: 'text' | 'number';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder: string;
  className: string;
  min?: number;
};

export default function FormInput({ 
  type,
  value,
  onChange,
  placeholder,
  className,
  min,
}: FormInputProps) {

  return (
    <input
      type={type}
      value={value || ''}
      onChange={(e) => {
        const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
        onChange(newValue);
      }}
      className={className}
      placeholder={placeholder}
      min={min}
    />
  );
}