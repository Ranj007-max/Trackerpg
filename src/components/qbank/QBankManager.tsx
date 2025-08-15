import React from 'react';
import { Subject } from '../../types';
import QBankItem from './QBankItem';

interface QBankManagerProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const QBankManager: React.FC<QBankManagerProps> = ({ subjects, setSubjects }) => {
  const updateSubject = (updatedSubject: Subject) => {
    setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-100">Question Bank Tracker</h2>
      </div>

      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <QBankItem 
              key={subject.id} 
              subject={subject} 
              onUpdate={updateSubject} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-800 rounded-lg">
          <p className="text-slate-400">Add subjects in the 'Manager' tab to track their question banks.</p>
        </div>
      )}
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default QBankManager;
