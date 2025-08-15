import React, { useState } from 'react';
import { Subject, LectureStatus } from '../types';
import { MBBS_SUBJECTS } from '../constants';
import AddSubjectModal from './modals/AddSubjectModal';
import BulkAddModal from './modals/BulkAddModal';
import SubjectItem from './SubjectItem';

interface SubjectManagerProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ subjects, setSubjects }) => {
  const [isAddSubjectModalOpen, setAddSubjectModalOpen] = useState(false);
  const [isBulkAddModalOpen, setBulkAddModalOpen] = useState(false);

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

  const handleBulkAdd = async (textLog: string) => {
    try {
      const response = await fetch('/.netlify/functions/parse-log-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ textLog }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Failed to parse log entry.');
      }

      const parsedData = await response.json();

      const confirmationMessage = `
        AI has parsed the following:
        -----------------------------
        Subject: ${parsedData.subjectName}
        Chapter: ${parsedData.chapterName}
        Lectures:
        ${parsedData.lectures.map((l: any) => `- ${l.name}`).join('\n')}
        -----------------------------
        Do you want to add this to your tracker?
      `;

      if (window.confirm(confirmationMessage)) {
        setSubjects(prevSubjects => {
          let newSubjects = [...prevSubjects];
          let subject = newSubjects.find(s => s.name.toLowerCase() === parsedData.subjectName.toLowerCase());

          // If subject doesn't exist, create it.
          if (!subject) {
            subject = {
              id: Date.now().toString(),
              name: parsedData.subjectName,
              chapters: [],
            };
            newSubjects.push(subject);
          }

          let chapter = subject.chapters.find(c => c.name.toLowerCase() === parsedData.chapterName.toLowerCase());

          // If chapter doesn't exist, create it.
          if (!chapter) {
            chapter = {
              id: Date.now().toString() + '-ch',
              name: parsedData.chapterName,
              lectures: [],
            };
            subject.chapters.push(chapter);
          }

          // Add new lectures, avoiding duplicates.
          const existingLectureNames = new Set(chapter.lectures.map(l => l.name.toLowerCase()));
          parsedData.lectures.forEach((newLecture: { name: string, platform?: string, faculty?: string }) => {
            if (!existingLectureNames.has(newLecture.name.toLowerCase())) {
              chapter!.lectures.push({
                id: Date.now().toString() + '-' + newLecture.name,
                name: newLecture.name,
                platform: newLecture.platform || '',
                faculty: newLecture.faculty || '',
                date: new Date().toISOString().split('T')[0],
                status: LectureStatus.Completed, // Default status for bulk-added lectures
              });
            }
          });

          newSubjects.sort((a,b) => a.name.localeCompare(b.name));
          return newSubjects;
        });
      }

    } catch (error) {
      console.error("Bulk add error:", error);
      alert(error instanceof Error ? `Error: ${error.message}` : 'An unknown error occurred during bulk add.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-100">Syllabus Manager</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setBulkAddModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104l-2.28 2.28-1.422 3.824 3.824-1.422 2.28-2.28a1.5 1.5 0 00-2.392-2.406zM12 6.375l2.25 2.25M12 6.375V3.75m0 2.625A2.625 2.625 0 1014.625 9 2.625 2.625 0 0012 6.375zM17.25 12.75a2.625 2.625 0 110-5.25 2.625 2.625 0 010 5.25zM12 17.25a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" /></svg>
            Bulk Add with AI
          </button>
          <button
            onClick={() => setAddSubjectModalOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Add Subject
          </button>
        </div>
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

      {isBulkAddModalOpen && (
        <BulkAddModal
          onClose={() => setBulkAddModalOpen(false)}
          onBulkAdd={handleBulkAdd}
        />
      )}
    </div>
  );
};

export default SubjectManager;
