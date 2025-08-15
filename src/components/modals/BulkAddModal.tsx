import React, { useState } from 'react';
import Modal from './Modal';

interface BulkAddModalProps {
  onClose: () => void;
  onBulkAdd: (textLog: string) => Promise<void>;
}

const BulkAddModal: React.FC<BulkAddModalProps> = ({ onClose, onBulkAdd }) => {
  const [textLog, setTextLog] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textLog.trim()) {
      alert("Please paste your study log into the text area.");
      return;
    }
    setIsLoading(true);
    try {
      await onBulkAdd(textLog);
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Bulk Add with AI" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="textLog" className="block text-sm font-medium text-slate-300 mb-1">
            Study Log
          </label>
          <textarea
            id="textLog"
            rows={10}
            value={textLog}
            onChange={(e) => setTextLog(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Today I studied Anatomy, focusing on the Thorax chapter. I watched lectures on 'Heart & Great Vessels' and 'Lungs & Pleura' from Marrow by Dr. Rakesh."
          />
          <p className="text-xs text-slate-400 mt-1">
            Describe the lectures you watched. Mention subject, chapter, and lecture names. The AI will do the rest.
          </p>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Parsing...
              </>
            ) : 'Parse and Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BulkAddModal;
