import { useState, useCallback } from 'react';

export function useFormState<T extends Record<string, unknown>>(
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues);

  const updateValue = useCallback((key: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void>) => async (e: React.FormEvent) => {
      e.preventDefault();
      await onSubmit(values);
      reset();
    },
    [values, reset]
  );

  return {
    values,
    updateValue,
    handleSubmit,
    reset
  };
}