interface LoadingOverlayProps {
    text?: string;
}

export default function LoadingOverlay({ text = "Chargement..." }: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-md backdrop-saturate-150 opacity-0 animate-fadeIn">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-sm sm:text-base font-medium animate-pulse mt-4">{text}</p>

            <style jsx>{`
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s forwards;
          }
        `}</style>
        </div>
    );
}
