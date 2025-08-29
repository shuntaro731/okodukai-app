type ErrorMessageProps = {
  message: string;
  onClose: () => void;
};

export default function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
      <span className="block sm:inline">{message}</span>
      <button
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
      >
        <span className="text-red-500 text-xl">×</span>
      </button>
    </div>
  );
}