import { useFormState } from '../../hooks/useFormState';
import type { Category } from '../../types';
import { INPUT_BASE_STYLE, CATEGORY_BUTTON_SELECTED, CATEGORY_BUTTON_UNSELECTED } from '../../constants/styles';
import FormInput from '../common/FormInput';
import SubmitButton from '../common/SubmitButton';

type ExpenseFormProps = {
  categories: Category[];
  onAddExpense: (amount: number, memo: string, category: string) => Promise<void>;
  loading?: boolean;
};

export default function ExpenseForm({ categories, onAddExpense, loading = false }: ExpenseFormProps) {
  const { values, updateValue, handleSubmit } = useFormState({
    amount: 0,
    memo: '',
    selectedCategory: 'other'
  });

  const onSubmit = handleSubmit(async (formValues) => {
    await onAddExpense(formValues.amount, formValues.memo, formValues.selectedCategory);
  });

  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <div>
        <FormInput
          type='number'
          value={values.amount}
          onChange={(value) => updateValue('amount', value)}
          className={INPUT_BASE_STYLE}
          placeholder='金額を入力'
          min={0}
        />
      </div>
      <div>
        <FormInput
          type='text'
          value={values.memo}
          onChange={(value) => updateValue('memo', value)}
          className={INPUT_BASE_STYLE}
          placeholder='メモを入力'
        />
      </div>
      
      {/* Category selection */}
      <div>
        <label className='text-gray-700 text-sm font-medium mb-2 block'>カテゴリ</label>
        <div className='grid grid-cols-3 gap-2'>
          {categories.map((category) => (
            <button
              key={category.id}
              type='button'
              onClick={() => updateValue('selectedCategory', category.id)}
              className={`p-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-colors ${
                values.selectedCategory === category.id
                  ? `${category.color} ${CATEGORY_BUTTON_SELECTED}`
                  : CATEGORY_BUTTON_UNSELECTED
              }`}
            >
              <span className='text-lg'>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <SubmitButton
        loading={loading}
        loadingText='追加中...'
        normalText='追加'
        bgColor='bg-purple-500'
        hoverColor='hover:bg-purple-600'
      />
    </form>
  );
}