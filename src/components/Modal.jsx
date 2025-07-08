import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4 sm:p-8 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3
                  className="text-2xl leading-7 font-bold text-gray-900 text-center mb-2"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-4">{children}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-full border border-gray-300 shadow px-4 py-2 bg-white text-base font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-base transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 