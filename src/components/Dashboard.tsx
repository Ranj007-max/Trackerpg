import React, { useMemo } from 'react';
import { Subject, LectureStatus } from '../types';

interface DashboardProps {
  subjects: Subject[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: JSX.Element; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-slate-400">{title}</h3>
            <p className="text-3xl font-bold text-slate-100">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ subjects }) => {

  const analysis = useMemo(() => {
    let totalLectures = 0;
    let completedLectures = 0;
    let inProgressSubjects = 0;
    const subjectProgress: { name: string; percentage: number, completed: number, total: number }[] = [];

    subjects.forEach(subject => {
      let subjectTotal = 0;
      let subjectCompleted = 0;
      subject.chapters.forEach(chapter => {
        subjectTotal += chapter.lectures.length;
        subjectCompleted += chapter.lectures.filter(l => l.status === LectureStatus.Completed).length;
      });
      totalLectures += subjectTotal;
      completedLectures += subjectCompleted;
      if (subjectTotal > 0) {
        if(subjectCompleted > 0) {
            inProgressSubjects++;
        }
        subjectProgress.push({
          name: subject.name,
          completed: subjectCompleted,
          total: subjectTotal,
          percentage: Math.round((subjectCompleted / subjectTotal) * 100),
        });
      }
    });

    const overallPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
    
    subjectProgress.sort((a, b) => b.percentage - a.percentage);

    return { totalLectures, completedLectures, overallPercentage, subjectProgress, inProgressSubjects };
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
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-100">Preparation Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Overall Progress" 
            value={`${analysis.overallPercentage}%`}
            color="bg-sky-500/30"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
            title="Lectures Completed" 
            value={`${analysis.completedLectures} / ${analysis.totalLectures}`}
            color="bg-emerald-500/30"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>}
        />
        <StatCard 
            title="Subjects Tracked" 
            value={subjects.length}
            color="bg-indigo-500/30"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />
        <StatCard 
            title="Subjects In Progress" 
            value={analysis.inProgressSubjects}
            color="bg-amber-500/30"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        />
      </div>

      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-slate-100 mb-6">Subject-wise Progress</h3>
        <div className="space-y-4">
            {analysis.subjectProgress.map(subject => (
                <div key={subject.name}>
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-slate-300">{subject.name}</span>
                        <span className="text-sm font-semibold text-sky-300">{subject.percentage}% ({subject.completed}/{subject.total})</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${subject.percentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;