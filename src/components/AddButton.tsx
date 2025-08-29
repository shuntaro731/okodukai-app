type AddButtonProps = {
  onClick: () => void;
}

export default function AddButton({ onClick }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className='fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white text-3xl leading-none shadow-lg hover:bg-blue-700 transition-colors'
      aria-label='追加'
    >
      +
    </button>
  )
} 