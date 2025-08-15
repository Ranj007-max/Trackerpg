import React, { useState, useMemo } from 'react';
import { Subject, Chapter, Lecture, LectureStatus } from '../types';
import AddChapterModal from './modals/AddChapterModal';
import ConfirmationModal from './modals/ConfirmationModal';
import AddOrEditLectureModal from './modals/AddOrEditLectureModal';
import ProgressiveBar from './ProgressiveBar';
import EditSubjectModal from './modals/EditSubjectModal';
import QuickAddLecture from './QuickAddLecture';

interface SubjectItemProps {
  subject: Subject;
  onUpdate: (subject: Subject) => void;
  onDelete: (subjectId: string) => void;
}

const statusConfig: { [key in LectureStatus]: { color: string; label: string } } = {
  [LectureStatus.NotStarted]: { color: 'bg-slate-500/20 text-slate-300', label: 'Not Started' },
  [LectureStatus.Started]: { color: 'bg-yellow-500/20 text-yellow-300', label: 'Started' },
  [LectureStatus.Completed]: { color: 'bg-green-500/20 text-green-300', label: 'Completed' },
  [LectureStatus.Revision]: { color: 'bg-fuchsia-500/20 text-fuchsia-300', label: 'Revision' },
};

const LectureStatusChanger: React.FC<{ lecture: Lecture; onChange: (newStatus: LectureStatus) => void; }> = ({ lecture, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentStatus = statusConfig[lecture.status];

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} onBlur={() => setTimeout(() => setIsOpen(false), 150)} className={`px-2.5 py-1 rounded-full text-xs font-semibold w-28 text-center transition-colors ${currentStatus.color}`}>
        {currentStatus.label}
      </button>
      {isOpen && (
        <div className="absolute z-10 bottom-full mb-2 w-32 bg-slate-700 border border-slate-600 rounded-md shadow-lg">
          {Object.values(LectureStatus).map(status => (
            <button key={status} onClick={() => { onChange(status); setIsOpen(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600">
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


const SubjectItem: React.FC<SubjectItemProps> = ({ subject, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddChapterModalOpen, setAddChapterModalOpen] = useState(false);
  const [isEditSubjectModalOpen, setEditSubjectModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isLectureModalOpen, setLectureModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<{ chapterId: string; lecture?: Lecture } | null>(null);

  const stats = useMemo(() => {
    const lectures = subject.chapters.flatMap(c => c.lectures);
    const total = lectures.length;
    const target = subject.totalLectures || total;
    const statusCounts = {
        [LectureStatus.NotStarted]: lectures.filter(l => l.status === LectureStatus.NotStarted).length,
        [LectureStatus.Started]: lectures.filter(l => l.status === LectureStatus.Started).length,
        [LectureStatus.Completed]: lectures.filter(l => l.status === LectureStatus.Completed).length,
        [LectureStatus.Revision]: lectures.filter(l => l.status === LectureStatus.Revision).length,
    };
    const completed = statusCounts[LectureStatus.Completed] + statusCounts[LectureStatus.Revision];
    const percentage = target > 0 ? Math.round((completed / target) * 100) : 0;
    return { ...statusCounts, total, target, completed, percentage };
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
                            videoUrl: lectureData.videoUrl || '',
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
                        videoUrl: lectureData.videoUrl || '',
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
  
  const handleLectureStatusChange = (chapterId: string, lectureId: string, newStatus: LectureStatus) => {
    const updatedChapters = subject.chapters.map(c => {
      if(c.id === chapterId) {
        return {
          ...c,
          lectures: c.lectures.map(l => l.id === lectureId ? { ...l, status: newStatus } : l)
        }
      }
      return c;
    });
    onUpdate({...subject, chapters: updatedChapters});
  }

  const handleToggleBookmark = (chapterId: string, lectureId: string) => {
    const updatedChapters = subject.chapters.map(c => {
      if (c.id === chapterId) {
        return {
          ...c,
          lectures: c.lectures.map(l => l.id === lectureId ? { ...l, isBookmarked: !l.isBookmarked } : l)
        }
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
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700/50">
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-slate-100">{subject.name}</h3>
            <span className="text-sm font-semibold text-cyan-300">{stats.percentage}% <span className="text-slate-400 font-normal">({stats.completed}/{stats.target})</span></span>
          </div>
          <ProgressiveBar stats={stats} total={stats.target} />
        </div>
        <div className="flex items-center ml-4">
          <button onClick={(e) => { e.stopPropagation(); setEditSubjectModalOpen(true); }} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors" title="Edit Subject"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
          <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-700 rounded-full transition-colors" title="Delete Subject"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="bg-slate-800/50 p-4 border-t border-slate-700">
          <div className="flex justify-end mb-4">
              <button onClick={() => setAddChapterModalOpen(true)} className="bg-slate-700 hover:bg-slate-600 text-sm font-semibold py-2 px-3 rounded-lg shadow-sm transition-colors">
                + Add Chapter
              </button>
          </div>
          {subject.chapters.length > 0 ? (
            <div className="space-y-3">
              {subject.chapters.map(chapter => (
                <div key={chapter.id} className="bg-slate-900/50 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-slate-200">{chapter.name}</h4>
                        <div>
                            <button onClick={() => openLectureModal(chapter.id)} className="px-2 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 rounded-md mr-2">+ Add Lecture</button>
                            <button onClick={() => handleDeleteChapter(chapter.id)} className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded-md">Delete Chapter</button>
                        </div>
                    </div>
                    <div>
                        {chapter.lectures.length > 0 ? (
                            <div className="space-y-2">
                               {chapter.lectures.map(lecture => (
                                   <div key={lecture.id} className="text-sm p-3 bg-slate-700/50 rounded-md">
                                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                           <div className="flex items-center gap-2 flex-grow">
                                                <button onClick={() => handleToggleBookmark(chapter.id, lecture.id)} className="p-1 text-slate-400 hover:text-yellow-400" title="Toggle Bookmark">
                                                    {lecture.isBookmarked ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69L11.049 2.927z" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <div className="font-medium text-slate-200">{lecture.name}</div>
                                           </div>
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
                                               <LectureStatusChanger lecture={lecture} onChange={(newStatus) => handleLectureStatusChange(chapter.id, lecture.id, newStatus)} />
                                               <div className="flex items-center">
                                                   {lecture.videoUrl && (
                                                      <a href={lecture.videoUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-slate-400 hover:text-cyan-400" title="Open Video Link">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                                      </a>
                                                    )}
                                                   <button onClick={() => openLectureModal(chapter.id, lecture)} className="p-1 text-slate-400 hover:text-sky-400" title="Edit Lecture"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                                   <button onClick={() => handleDeleteLecture(chapter.id, lecture.id)} className="p-1 text-slate-400 hover:text-red-400" title="Delete Lecture"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                               </div>
                                           </div>
                                           {lecture.tags && lecture.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2 pl-8">
                                                    {lecture.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-0.5 text-xs bg-sky-500/20 text-sky-300 rounded-full">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                       </div>
                                   </div>
                               ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm italic">No lectures added for this chapter.</p>
                        )}
                        <QuickAddLecture onAdd={(name) => handleAddOrUpdateLecture(chapter.id, { name }, 1)} />
                    </div>
                </div>
              ))}
            </div>
          ) : <p className="text-slate-400 text-center">No chapters added yet.</p>}
        </div>
      )}
      
      {isAddChapterModalOpen && <AddChapterModal onClose={() => setAddChapterModalOpen(false)} onAddChapter={handleAddChapter} />}
      {isConfirmDeleteOpen && <ConfirmationModal title="Delete Subject" message={`Are you sure you want to delete "${subject.name}" and all its data? This action cannot be undone.`} onConfirm={() => onDelete(subject.id)} onCancel={() => setConfirmDeleteOpen(false)} />}
      {isLectureModalOpen && editingLecture && <AddOrEditLectureModal onClose={() => setLectureModalOpen(false)} onSave={(data, bulkCount) => handleAddOrUpdateLecture(editingLecture.chapterId, data, bulkCount)} lecture={editingLecture.lecture} />}
      {isEditSubjectModalOpen && <EditSubjectModal onClose={() => setEditSubjectModalOpen(false)} onSave={(updatedSub) => { onUpdate(updatedSub); setEditSubjectModalOpen(false); }} subject={subject} />}
    </div>
  );
};

export default SubjectItem;
