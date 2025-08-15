import React, { useState } from 'react';

interface QuickAddLectureProps {
  onAdd: (name: string) => void;
}

const QuickAddLecture: React.FC<QuickAddLectureProps> = ({ onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-3 pl-8">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Quick add new lecture..."
        className="flex-grow bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
      />
      <button
        type="submit"
        className="px-3 py-1.5 text-sm font-semibold bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!name.trim()}
      >
        Add
      </button>
    </form>
  );
};

export default QuickAddLecture;
