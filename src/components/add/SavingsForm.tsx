import { useFormState } from '../../hooks/useFormState';
import { INPUT_GREEN_STYLE } from '../../constants/styles';
import FormInput from '../common/FormInput';
import SubmitButton from '../common/SubmitButton';

type SavingsFormProps = {
  onAddSavings: (amount: number, memo: string) => Promise<void>;
  loading?: boolean;
};

export default function SavingsForm({ onAddSavings, loading = false }: SavingsFormProps) {
  const { values, updateValue, handleSubmit } = useFormState({
    savingsAmount: 0,
    savingsMemo: ''
  });

  const onSubmit = handleSubmit(async (formValues) => {
    await onAddSavings(formValues.savingsAmount, formValues.savingsMemo);
  });

  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <div>
        <FormInput
          type='number'
          value={values.savingsAmount}
          onChange={(value) => updateValue('savingsAmount', value)}
          className={INPUT_GREEN_STYLE}
          placeholder='貯金額を入力'
          min={0}
        />
      </div>
      <div>
        <FormInput
          type='text'
          value={values.savingsMemo}
          onChange={(value) => updateValue('savingsMemo', value)}
          className={INPUT_GREEN_STYLE}
          placeholder='メモを入力'
        />
      </div>
      
      <SubmitButton
        loading={loading}
        loadingText='追加中...'
        normalText='貯金を追加'
        bgColor='bg-green-500'
        hoverColor='hover:bg-green-600'
      />
    </form>
  );
}