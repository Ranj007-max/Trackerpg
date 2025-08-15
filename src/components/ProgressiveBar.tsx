import React from 'react';
import { LectureStatus } from '../types';

interface ProgressiveBarProps {
  stats: { [key in LectureStatus]: number };
  total: number;
}

const ProgressiveBar: React.FC<ProgressiveBarProps> = ({ stats, total }) => {
  if (total === 0) {
    return <div className="w-full bg-slate-700 rounded-full h-3"></div>;
  }

  const startedWidth = (stats[LectureStatus.Started] / total) * 100;
  const completedWidth = (stats[LectureStatus.Completed] / total) * 100;
  const revisionWidth = (stats[LectureStatus.Revision] / total) * 100;
  
  return (
    <div className="w-full bg-slate-700 rounded-full h-3 flex overflow-hidden">
      <div 
        className="bg-green-500 h-full transition-all duration-500" 
        style={{ width: `${completedWidth}%` }}
        title={`${stats[LectureStatus.Completed]} Completed`}
      ></div>
      <div 
        className="bg-fuchsia-500 h-full transition-all duration-500" 
        style={{ width: `${revisionWidth}%` }}
        title={`${stats[LectureStatus.Revision]} In Revision`}
      ></div>
      <div 
        className="bg-yellow-500 h-full transition-all duration-500" 
        style={{ width: `${startedWidth}%` }}
        title={`${stats[LectureStatus.Started]} Started`}
      ></div>
    </div>
  );
};

export default ProgressiveBar;