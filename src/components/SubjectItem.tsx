import React, { useState, useMemo } from 'react';
import { Subject, Chapter, Lecture, LectureStatus } from '../types';
import AddChapterModal from './modals/AddChapterModal';
import ConfirmationModal from './modals/ConfirmationModal';
import AddOrEditLectureModal from './modals/AddOrEditLectureModal';

interface SubjectItemProps {
  subject: Subject;
  onUpdate: (subject: Subject) => void;
  onDelete: (subjectId: string) => void;
}

const SubjectItem: React.FC<SubjectItemProps> = ({ subject, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddChapterModalOpen, setAddChapterModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isLectureModalOpen, setLectureModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<{ chapterId: string; lecture?: Lecture } | null>(null);

  const progress = useMemo(() => {
    const lectures = subject.chapters.flatMap(c => c.lectures);
    if (lectures.length === 0) return 0;
    const completed = lectures.filter(l => l.status === LectureStatus.Completed).length;
    return Math.round((completed / lectures.length) * 100);
  }, [subject]);
  
  const handleAddChapter = (name: string) => {
    const newChapter: Chapter = { id: Date.now().toString(), name, lectures: [] };
    onUpdate({ ...subject, chapters: [...subject.chapters, newChapter] });
  };
  
  const handleDeleteChapter = (chapterId: string) => {
    onUpdate({ ...subject, chapters: subject.chapters.filter(c => c.id !== chapterId) });
  };
  
  const handleAddOrUpdateLecture = (chapterId: string, lectureData: Partial<Lecture>, bulkCount: number) => {
      const updatedChapters = subject.chapters.map(c => {
        if (c.id === chapterId) {
            let newLectures = [...c.lectures];
            if (lectureData.id) { // Editing existing
                newLectures = newLectures.map(l => l.id === lectureData.id ? { ...l, ...lectureData } as Lecture : l);
            } else { // Adding new
                if (bulkCount > 1) {
                    for (let i = 1; i <= bulkCount; i++) {
                        newLectures.push({
                            id: `${Date.now()}-${i}`,
                            name: `${lectureData.name} ${i}`,
                            date: lectureData.date || new Date().toISOString().split('T')[0],
                            platform: lectureData.platform || '',
                            faculty: lectureData.faculty || '',
                            status: lectureData.status || LectureStatus.NotStarted,
                        });
                    }
                } else {
                     newLectures.push({
                        id: Date.now().toString(),
                        name: lectureData.name || 'New Lecture',
                        date: lectureData.date || new Date().toISOString().split('T')[0],
                        platform: lectureData.platform || '',
                        faculty: lectureData.faculty || '',
                        status: lectureData.status || LectureStatus.NotStarted,
                    });
                }
            }
            return { ...c, lectures: newLectures };
        }
        return c;
    });
    onUpdate({ ...subject, chapters: updatedChapters });
    setEditingLecture(null);
    setLectureModalOpen(false);
  };
  
  const handleDeleteLecture = (chapterId: string, lectureId: string) => {
    const updatedChapters = subject.chapters.map(c => {
        if (c.id === chapterId) {
            return { ...c, lectures: c.lectures.filter(l => l.id !== lectureId) };
        }
        return c;
    });
    onUpdate({ ...subject, chapters: updatedChapters });
  };

  const openLectureModal = (chapterId: string, lecture?: Lecture) => {
    setEditingLecture({ chapterId, lecture });
    setLectureModalOpen(true);
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-slate-100">{subject.name}</h3>
            <span className="text-sm font-semibold text-sky-300">{progress}% Complete</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="flex items-center ml-4">
          <button onClick={(e) => { e.stopPropagation(); setAddChapterModalOpen(true); }} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></button>
          <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-700 rounded-full transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="bg-slate-800/50 p-4 border-t border-slate-700">
          {subject.chapters.length > 0 ? (
            <div className="space-y-3">
              {subject.chapters.map(chapter => (
                <div key={chapter.id} className="bg-slate-700/80 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-slate-200">{chapter.name}</h4>
                        <div>
                            <button onClick={() => openLectureModal(chapter.id)} className="px-2 py-1 text-xs bg-sky-600 hover:bg-sky-700 rounded-md mr-2">+ Add Lecture</button>
                            <button onClick={() => handleDeleteChapter(chapter.id)} className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded-md">Delete Chapter</button>
                        </div>
                    </div>
                    {chapter.lectures.length > 0 ? (
                        <div className="space-y-2">
                           {chapter.lectures.map(lecture => (
                               <div key={lecture.id} className="flex flex-col md:flex-row md:items-center justify-between text-sm p-3 bg-slate-900/50 rounded-md gap-3">
                                   <div className="flex-grow font-medium text-slate-200">{lecture.name}</div>
                                   <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 text-xs">
                                       {lecture.platform && (
                                         <div className="flex items-center gap-1.5" title="Platform">
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                             <span>{lecture.platform}</span>
                                         </div>
                                       )}
                                       {lecture.faculty && (
                                          <div className="flex items-center gap-1.5" title="Faculty">
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                             <span>{lecture.faculty}</span>
                                          </div>
                                       )}
                                   </div>
                                   <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                                       <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${lecture.status === LectureStatus.Completed ? 'bg-green-500/20 text-green-300' : lecture.status === LectureStatus.InProgress ? 'bg-yellow-500/20 text-yellow-300' : 'bg-slate-500/20 text-slate-300'}`}>{lecture.status}</span>
                                       <div className="flex items-center">
                                           <button onClick={() => openLectureModal(chapter.id, lecture)} className="p-1 text-slate-400 hover:text-sky-400" title="Edit Lecture"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                           <button onClick={() => handleDeleteLecture(chapter.id, lecture.id)} className="p-1 text-slate-400 hover:text-red-400" title="Delete Lecture"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                       </div>
                                   </div>
                               </div>
                           ))}
                        </div>
                    ) : <p className="text-slate-400 text-sm italic">No lectures added for this chapter.</p>}
                </div>
              ))}
            </div>
          ) : <p className="text-slate-400 text-center">No chapters added yet.</p>}
        </div>
      )}
      
      {isAddChapterModalOpen && <AddChapterModal onClose={() => setAddChapterModalOpen(false)} onAddChapter={handleAddChapter} />}
      {isConfirmDeleteOpen && <ConfirmationModal title="Delete Subject" message={`Are you sure you want to delete "${subject.name}" and all its data? This action cannot be undone.`} onConfirm={() => onDelete(subject.id)} onCancel={() => setConfirmDeleteOpen(false)} />}
      {isLectureModalOpen && editingLecture && <AddOrEditLectureModal onClose={() => setLectureModalOpen(false)} onSave={(data, bulkCount) => handleAddOrUpdateLecture(editingLecture.chapterId, data, bulkCount)} lecture={editingLecture.lecture} />}
    </div>
  );
};

export default SubjectItem;