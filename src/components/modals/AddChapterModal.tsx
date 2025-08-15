import React, { useState } from 'react';
import Modal from './Modal';

interface AddChapterModalProps {
  onClose: () => void;
  onAddChapter: (chapterName: string) => void;
}

const AddChapterModal: React.FC<AddChapterModalProps> = ({ onClose, onAddChapter }) => {
  const [chapterName, setChapterName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chapterName.trim()) {
      onAddChapter(chapterName.trim());
      onClose();
    }
  };

  return (
    <Modal title="Add New Chapter" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="chapterName" className="block text-sm font-medium text-slate-300 mb-1">Chapter Name</label>
          <input
            id="chapterName"
            type="text"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="e.g., General Anatomy"
            autoFocus
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-600 transition-colors font-semibold">Add Chapter</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddChapterModal;