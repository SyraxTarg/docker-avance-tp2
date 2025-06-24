import { Trash2 } from "lucide-react";


type DeleteButtonProps = {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
};

export default function DeleteButton(
  {
    onClick,
    label = "Delete",
    disabled = false
  }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-medium rounded-2xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
    >
      <Trash2 size={18} />
      {label}
    </button>
  );
}
