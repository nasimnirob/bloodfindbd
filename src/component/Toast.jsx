import { MdCheckCircle, MdClose } from "react-icons/md";

const Toast = ({ message, onClose }) => {
  return (
    <div className="fixed right-5 top-5 z-[9999] w-[360px] rounded-lg border border-green-200 bg-green-50 px-4 py-3 shadow-lg">
      <div className="flex items-center gap-3">
        
        {/* Success Icon */}
        <MdCheckCircle className="shrink-0 text-xl text-green-600" />

        {/* Message */}
        <p className="flex-1 text-sm font-medium text-green-700">
          {message}
        </p>

        {/* Close */}
        <button
          onClick={onClose}
          className="text-green-600 transition hover:text-green-800"
        >
          <MdClose className="text-lg" />
        </button>

      </div>
    </div>
  );
};

export default Toast;