import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface TransactionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'success' | 'error';
  message?: string;
}

const TransactionPopup: React.FC<TransactionPopupProps> = ({ isOpen, onClose, status, message }) => {
  const { isDarkTheme } = useApp();

  const defaultMessages = {
    success: '¡Transacción exitosa! Su pago ha sido aprobado.',
    error: 'Lo sentimos, la transacción no pudo ser completada.'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`rounded-lg p-8 w-96 shadow-lg ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-600 to-violet-600'} relative`}
          >
            <div className="flex flex-col items-center text-center">
              {status === 'success' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <CheckCircleIcon className="w-20 h-20 text-green-400" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <XCircleIcon className="w-20 h-20 text-red-400" />
                </motion.div>
              )}
              <h2 className="text-2xl font-bold text-white mt-6 mb-2">
                {status === 'success' ? '¡Éxito!' : 'Error'}
              </h2>
              <p className="text-gray-200 mb-6">
                {message || defaultMessages[status]}
              </p>
              <button
                onClick={onClose}
                className={`px-6 py-2 rounded-full text-white font-medium transition-all duration-300 ${status === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionPopup;