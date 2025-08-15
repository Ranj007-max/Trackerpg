import React, { useState } from 'react';
import Modal from './Modal';
import { Subject } from '../../types';

interface EditSubjectModalProps {
  onClose: () => void;
  onSave: (subject: Subject) => void;
  subject: Subject;
}

const EditSubjectModal: React.FC<EditSubjectModalProps> = ({ onClose, onSave, subject }) => {
  const [name, setName] = useState(subject.name);
  const [totalLectures, setTotalLectures] = useState<string>(subject.totalLectures?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const lectures = totalLectures ? parseInt(totalLectures, 10) : undefined;
      onSave({ ...subject, name: name.trim(), totalLectures: lectures });
      onClose();
    }
  };

  return (
    <Modal title={`Edit ${subject.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Subject Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="totalLectures" className="block text-sm font-medium text-slate-300 mb-1">Total Lectures (Optional)</label>
          <input
            id="totalLectures"
            type="number"
            min="1"
            value={totalLectures}
            onChange={(e) => setTotalLectures(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g., 150"
          />
          <p className="text-xs text-slate-400 mt-1">Update the target number of lectures for this subject.</p>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-md bg-cyan-500 hover:bg-cyan-600 transition-colors font-semibold">Save Changes</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSubjectModal;
