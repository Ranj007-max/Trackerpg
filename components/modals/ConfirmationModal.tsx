
import React from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  
  const handleConfirm = () => {
    onConfirm();
    onCancel(); // Close modal after confirmation
  };

  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <div className="space-y-6">
        <p className="text-slate-300">{message}</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition-colors font-semibold">{cancelText}</button>
          <button onClick={handleConfirm} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors font-semibold text-white">{confirmText}</button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
