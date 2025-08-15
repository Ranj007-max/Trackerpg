import React, { useState } from 'react';
import { Subject } from '../types';
import { MBBS_SUBJECTS } from '../constants';
import AddSubjectModal from './modals/AddSubjectModal';
import SubjectItem from './SubjectItem';

interface SubjectManagerProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ subjects, setSubjects }) => {
  const [isAddSubjectModalOpen, setAddSubjectModalOpen] = useState(false);

  const addSubject = (subjectName: string, totalLectures?: number) => {
    if (subjects.some(s => s.name === subjectName)) {
      alert("Subject already exists!");
      return;
    }
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: subjectName,
      chapters: [],
      totalLectures: totalLectures && totalLectures > 0 ? totalLectures : undefined,
    };
    setSubjects(prev => [...prev, newSubject].sort((a,b) => a.name.localeCompare(b.name)));
  };

  const updateSubject = (updatedSubject: Subject) => {
    setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
  };
  
  const deleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
  };

  const availableSubjects = MBBS_SUBJECTS.filter(
    (name) => !subjects.some((s) => s.name === name)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-100">Syllabus Manager</h2>
        <button
          onClick={() => setAddSubjectModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Add Subject
        </button>
      </div>

      {subjects.length > 0 ? (
        <div className="space-y-4">
          {subjects.map(subject => (
            <SubjectItem 
              key={subject.id} 
              subject={subject} 
              onUpdate={updateSubject} 
              onDelete={deleteSubject}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-800 rounded-lg">
          <p className="text-slate-400">You haven't added any subjects yet.</p>
          <p className="text-slate-500 mt-2">Click "+ Add Subject" to get started!</p>
        </div>
      )}

      {isAddSubjectModalOpen && (
        <AddSubjectModal
          onClose={() => setAddSubjectModalOpen(false)}
          onAddSubject={addSubject}
          availableSubjects={availableSubjects}
        />
      )}
    </div>
  );
};

export default SubjectManager;
