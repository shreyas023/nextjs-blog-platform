// components/Modal.js
export default function Modal({ onClose, children }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  }
  