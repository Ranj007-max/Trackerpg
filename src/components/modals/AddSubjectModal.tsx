import React, { useState } from 'react';
import Modal from './Modal';

interface AddSubjectModalProps {
  onClose: () => void;
  onAddSubject: (subjectName: string, totalLectures?: number) => void;
  availableSubjects: string[];
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ onClose, onAddSubject, availableSubjects }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(availableSubjects[0] || '');
  const [totalLectures, setTotalLectures] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubject) {
      const lectures = totalLectures ? parseInt(totalLectures, 10) : undefined;
      onAddSubject(selectedSubject, lectures);
      onClose();
    }
  };

  return (
    <Modal title="Add New Subject" onClose={onClose}>
      {availableSubjects.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">Select Subject</label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {availableSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
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
             <p className="text-xs text-slate-400 mt-1">Set a target number of lectures for this subject.</p>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-cyan-500 hover:bg-cyan-600 transition-colors font-semibold">Add Subject</button>
          </div>
        </form>
      ) : (
        <div>
          <p className="text-center text-slate-400">All subjects have been added.</p>
           <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition-colors">Close</button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddSubjectModal;