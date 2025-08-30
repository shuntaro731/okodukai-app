type AddButtonProps = {
  onClick: () => void;
};

export default function AddButton({ onClick }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-colors z-50"
      aria-label="新しい項目を追加"
    >
      +
    </button>
  );
}