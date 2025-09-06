import { BUTTON_BASE_STYLE, LOADING_BUTTON_STYLE } from '../../constants/styles';

type SubmitButtonProps = {
  loading: boolean;
  loadingText: string;
  normalText: string;
  bgColor: string;
  hoverColor: string;
};

export default function SubmitButton({ 
  loading, 
  loadingText, 
  normalText, 
  bgColor, 
  hoverColor 
}: SubmitButtonProps) {
  return (
    <button 
      type='submit'
      disabled={loading}
      className={`${BUTTON_BASE_STYLE} ${
        loading
          ? LOADING_BUTTON_STYLE
          : `${bgColor} ${hoverColor}`
      }`}
    >
      {loading ? loadingText : normalText}
    </button>
  );
}