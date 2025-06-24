interface Props {
  text: string;
  isLoading?: boolean;
}

export default function AuthButton({ text, isLoading = false }: Props) {
  return (
    <div>
      <button
        type="submit"
        className={`w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#4338CA] hover:bg-[#6366F1] text-white cursor-pointer ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
            Chargement...
          </>
        ) : (
          text
        )}
      </button>
    </div>
  );
}
