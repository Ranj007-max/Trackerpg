import React, { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Subject, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import SubjectManager from './components/SubjectManager';
import { downloadDataAsJson, uploadDataFromJson, downloadDataAsPdf } from './utils/dataManager';
import ProfileModal from './components/modals/ProfileModal';

type View = 'dashboard' | 'manager';

const App: React.FC = () => {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('trackerpg-subjects', []);
  const [profile, setProfile] = useLocalStorage<UserProfile>('trackerpg-profile', {
    name: '',
    targetYear: '',
    mbbsYear: '1st Year',
  });
  const [view, setView] = useState<View>('dashboard');
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Prompt user to set their name if it's not set
  useEffect(() => {
    if (!profile.name) {
        setTimeout(() => setProfileModalOpen(true), 1000);
    }
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        if(window.confirm('This will overwrite your current data. Are you sure?')) {
          const data = await uploadDataFromJson(file);
          setSubjects(data);
          alert('Data imported successfully!');
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : 'An unknown error occurred.');
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100">
      <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            <div>
              <h1 className="text-xl font-bold text-slate-50">TrackerPG</h1>
              <p className="text-xs text-slate-400">Welcome, {profile.name || 'Guest'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={handleFileUpload}
            />
            <div className="hidden sm:flex items-center space-x-2">
              <button onClick={triggerFileUpload} title="Upload JSON" className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </button>
              <button onClick={() => downloadDataAsJson(subjects)} title="Download JSON" className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
              <button onClick={() => downloadDataAsPdf(subjects, profile)} title="Download PDF Report" className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </button>
            </div>
            <div className="bg-slate-700 p-1 rounded-lg flex space-x-1">
              <button onClick={() => setView('dashboard')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${view === 'dashboard' ? 'bg-sky-500 text-white' : 'hover:bg-slate-600'}`}>Dashboard</button>
              <button onClick={() => setView('manager')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${view === 'manager' ? 'bg-sky-500 text-white' : 'hover:bg-slate-600'}`}>Manager</button>
            </div>
             <button onClick={() => setProfileModalOpen(true)} title="Edit Profile" className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && <Dashboard subjects={subjects} />}
        {view === 'manager' && <SubjectManager subjects={subjects} setSubjects={setSubjects} />}
      </main>
       <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-slate-500 text-sm">
         <p>TrackerPG - Your Personal NEET PG Syllabus Companion</p>
       </footer>
       {isProfileModalOpen && <ProfileModal onClose={() => setProfileModalOpen(false)} onSave={setProfile} currentProfile={profile} />}
    </div>
  );
};

export default App;