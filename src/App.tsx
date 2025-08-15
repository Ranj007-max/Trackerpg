import React, { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Subject, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import SubjectManager from './components/SubjectManager';
import { downloadDataAsJson, uploadDataFromJson, downloadDataAsPdf } from './utils/dataManager';
import ProfileModal from './components/modals/ProfileModal';
import QBankManager from './components/qbank/QBankManager';

type View = 'dashboard' | 'manager' | 'qbank';
type Theme = 'light' | 'dark';

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
  const [theme, setTheme] = useLocalStorage<Theme>('trackerpg-theme', 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

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

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-primary-dark text-text-primary-dark' : 'bg-primary-light text-text-primary-light'}`}>
      <header className="backdrop-blur-sm sticky top-0 z-40 border-b border-border-color bg-secondary-light/80 dark:bg-secondary-dark/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent-light dark:text-accent-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            <div>
              <h1 className="text-xl font-bold">TrackerPG</h1>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Welcome, {profile.name || 'Guest'}</p>
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
              <button onClick={triggerFileUpload} title="Upload JSON" className="p-2 rounded-md bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors border border-border-color">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </button>
              <button onClick={() => downloadDataAsJson(subjects)} title="Download JSON" className="p-2 rounded-md bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors border border-border-color">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
              <button onClick={() => downloadDataAsPdf(subjects, profile)} title="Download PDF Report" className="p-2 rounded-md bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors border border-border-color">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </button>
            </div>
            <div className="bg-primary-light dark:bg-primary-dark p-1 rounded-lg flex space-x-1 border border-border-color">
              <button onClick={() => setView('dashboard')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${view === 'dashboard' ? 'bg-accent-light dark:bg-accent-dark text-white' : 'hover:bg-secondary-light dark:hover:bg-secondary-dark'}`}>Dashboard</button>
              <button onClick={() => setView('manager')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${view === 'manager' ? 'bg-accent-light dark:bg-accent-dark text-white' : 'hover:bg-secondary-light dark:hover:bg-secondary-dark'}`}>Manager</button>
               <button onClick={() => setView('qbank')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${view === 'qbank' ? 'bg-accent-light dark:bg-accent-dark text-white' : 'hover:bg-secondary-light dark:hover:bg-secondary-dark'}`}>QBank</button>
            </div>
             <button onClick={toggleTheme} title="Toggle Theme" className="p-2 rounded-full bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors border border-border-color">
                {theme === 'dark' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707-.707M6.343 17.657l-.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
            </button>
             <button onClick={() => setProfileModalOpen(true)} title="Edit Profile" className="p-2 rounded-full bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors border border-border-color">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && <Dashboard subjects={subjects} />}
        {view === 'manager' && <SubjectManager subjects={subjects} setSubjects={setSubjects} />}
        {view === 'qbank' && <QBankManager subjects={subjects} setSubjects={setSubjects} />}
      </main>
       <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-text-secondary-light dark:text-text-secondary-dark text-sm">
         <p>TrackerPG - Your Personal NEET PG Syllabus Companion</p>
       </footer>
       {isProfileModalOpen && <ProfileModal onClose={() => setProfileModalOpen(false)} onSave={setProfile} currentProfile={profile} />}
    </div>
  );
};

export default App;