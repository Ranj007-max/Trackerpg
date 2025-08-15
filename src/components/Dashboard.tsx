import React, { useMemo } from 'react';
import { Subject, LectureStatus } from '../types';
import ProgressiveBar from './ProgressiveBar';

interface DashboardProps {
  subjects: Subject[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 border border-slate-700/50">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-bold text-slate-100">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ subjects }) => {

  const analysis = useMemo(() => {
    let totalLectures = 0;
    let startedLectures = 0;
    let completedLectures = 0;
    let revisionLectures = 0;
    let totalQBankQuestions = 0;
    let solvedQBankQuestions = 0;
    
    const subjectProgress: { name: string; stats: { [key in LectureStatus]: number }; total: number; target: number; }[] = [];

    subjects.forEach(subject => {
      const lectures = subject.chapters.flatMap(c => c.lectures);
      const subjectStats = {
          [LectureStatus.NotStarted]: lectures.filter(l => l.status === LectureStatus.NotStarted).length,
          [LectureStatus.Started]: lectures.filter(l => l.status === LectureStatus.Started).length,
          [LectureStatus.Completed]: lectures.filter(l => l.status === LectureStatus.Completed).length,
          [LectureStatus.Revision]: lectures.filter(l => l.status === LectureStatus.Revision).length,
      };

      startedLectures += subjectStats[LectureStatus.Started];
      completedLectures += subjectStats[LectureStatus.Completed];
      revisionLectures += subjectStats[LectureStatus.Revision];
      totalLectures += lectures.length;

      if (subject.qbank) {
        totalQBankQuestions += subject.qbank.totalQuestions || 0;
        solvedQBankQuestions += subject.qbank.solvedQuestions || 0;
      }

      if (lectures.length > 0 || subject.totalLectures) {
        subjectProgress.push({
          name: subject.name,
          stats: subjectStats,
          total: lectures.length,
          target: subject.totalLectures || lectures.length,
        });
      }
    });
    
    const totalCompletedOrRevision = completedLectures + revisionLectures;
    const overallPercentage = totalLectures > 0 ? Math.round((totalCompletedOrRevision / totalLectures) * 100) : 0;
    
    subjectProgress.sort((a, b) => {
        const aProgress = a.target > 0 ? (a.stats[LectureStatus.Completed] + a.stats[LectureStatus.Revision]) / a.target : 0;
        const bProgress = b.target > 0 ? (b.stats[LectureStatus.Completed] + b.stats[LectureStatus.Revision]) / b.target : 0;
        return bProgress - aProgress;
    });

    return { totalLectures, startedLectures, completedLectures, revisionLectures, overallPercentage, subjectProgress, totalQBankQuestions, solvedQBankQuestions };
  }, [subjects]);
  
  if (subjects.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-800 rounded-lg">
        <h2 className="text-3xl font-bold text-slate-100 mb-4">Welcome to Your Dashboard!</h2>
        <p className="text-slate-400 max-w-md mx-auto">It looks like you're just getting started. Head over to the 'Manager' tab to add your first subject and begin tracking your progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-100">Preparation Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard 
            title="Overall Progress" 
            value={`${analysis.overallPercentage}%`}
            color="bg-cyan-500/20"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
            title="Completed" 
            value={analysis.completedLectures}
            color="bg-emerald-500/20"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>}
        />
        <StatCard 
            title="In Revision" 
            value={analysis.revisionLectures}
            color="bg-fuchsia-500/20"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M4 18v-5h5m11-4h-5v5m5-5v-5h-5" /></svg>}
        />
         <StatCard 
            title="Questions Solved" 
            value={`${analysis.solvedQBankQuestions} / ${analysis.totalQBankQuestions}`}
            color="bg-amber-500/20"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
         <StatCard 
            title="Lectures Logged" 
            value={analysis.totalLectures}
            color="bg-indigo-500/20"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
        <h3 className="text-xl font-semibold text-slate-100 mb-6">Subject-wise Progress</h3>
        <div className="space-y-5">
            {analysis.subjectProgress.map(sub => {
                const completed = sub.stats[LectureStatus.Completed] + sub.stats[LectureStatus.Revision];
                const percentage = sub.target > 0 ? Math.round((completed / sub.target) * 100) : 0;
                return (
                    <div key={sub.name}>
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="font-medium text-slate-300">{sub.name}</span>
                            <span className="text-sm font-semibold text-cyan-300">{percentage}% ({completed}/{sub.target})</span>
                        </div>
                        <ProgressiveBar stats={sub.stats} total={sub.target} />
                    </div>
                )
            })}
        </div>
      </div>
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

export default Dashboard;