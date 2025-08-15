import React, { useState, useEffect, useMemo } from 'react';
import { Subject, QBank } from '../../types';

interface QBankItemProps {
  subject: Subject;
  onUpdate: (subject: Subject) => void;
}

const QBankItem: React.FC<QBankItemProps> = ({ subject, onUpdate }) => {
  const [qbankData, setQBankData] = useState<QBank>({
    totalQuestions: subject.qbank?.totalQuestions || 0,
    solvedQuestions: subject.qbank?.solvedQuestions || 0,
    pdfUrl: subject.qbank?.pdfUrl || '',
  });

  useEffect(() => {
    setQBankData({
        totalQuestions: subject.qbank?.totalQuestions || 0,
        solvedQuestions: subject.qbank?.solvedQuestions || 0,
        pdfUrl: subject.qbank?.pdfUrl || '',
    });
  }, [subject.qbank]);

  const progress = useMemo(() => {
    if (qbankData.totalQuestions === 0) return 0;
    return Math.round((qbankData.solvedQuestions / qbankData.totalQuestions) * 100);
  }, [qbankData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'pdfUrl') {
      setQBankData(prev => ({ ...prev, [name]: value }));
    } else {
      const numValue = parseInt(value, 10);
      setQBankData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    }
  };
  
  const handleSave = () => {
    // Ensure solved is not more than total
    const validatedData = {
        ...qbankData,
        solvedQuestions: Math.min(qbankData.solvedQuestions, qbankData.totalQuestions)
    };
    onUpdate({ ...subject, qbank: validatedData });
  };
  
  const hasChanged = qbankData.totalQuestions !== (subject.qbank?.totalQuestions || 0) || 
                     qbankData.solvedQuestions !== (subject.qbank?.solvedQuestions || 0) ||
                     qbankData.pdfUrl !== (subject.qbank?.pdfUrl || '');

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-5 border border-slate-700/50 flex flex-col space-y-4">
      <h3 className="text-xl font-bold text-slate-100 truncate">{subject.name}</h3>
      
      <div>
        <div className="flex justify-between items-center mb-1.5">
            <span className="font-medium text-slate-300">Progress</span>
            <span className="text-sm font-semibold text-amber-300">{progress}% ({qbankData.solvedQuestions}/{qbankData.totalQuestions})</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <label htmlFor={`solved-${subject.id}`} className="block text-sm font-medium text-slate-300 mb-1">Solved</label>
            <input
                id={`solved-${subject.id}`}
                name="solvedQuestions"
                type="number"
                min="0"
                value={qbankData.solvedQuestions}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
        </div>
        <div>
            <label htmlFor={`total-${subject.id}`} className="block text-sm font-medium text-slate-300 mb-1">Total</label>
            <input
                id={`total-${subject.id}`}
                name="totalQuestions"
                type="number"
                min="0"
                value={qbankData.totalQuestions}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
        </div>
      </div>

      <div>
          <label htmlFor={`pdfUrl-${subject.id}`} className="block text-sm font-medium text-slate-300 mb-1">PDF URL (Optional)</label>
          <input
              id={`pdfUrl-${subject.id}`}
              name="pdfUrl"
              type="url"
              value={qbankData.pdfUrl}
              onChange={handleInputChange}
              className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="https://drive.google.com/..."
          />
      </div>
      
      <div className="pt-2 flex items-center space-x-2">
        {subject.qbank?.pdfUrl && (
          <a
            href={subject.qbank.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"
          >
            View PDF
          </a>
        )}
        <button
            onClick={handleSave}
            disabled={!hasChanged}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default QBankItem;