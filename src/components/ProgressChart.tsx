import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Subject, LectureStatus } from '../types';

interface ProgressChartProps {
  subjects: Subject[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ subjects }) => {
  const data = subjects.map(subject => {
    const allLectures = subject.chapters.flatMap(chapter => chapter.lectures);
    const completedLectures = allLectures.filter(lecture => lecture.status === LectureStatus.Completed).length;
    const totalLectures = allLectures.length;
    const completion = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;

    return {
      name: subject.name,
      completion: parseFloat(completion.toFixed(2)),
    };
  });

  if (subjects.length === 0) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg text-center">
        <h3 className="text-lg font-bold mb-4 text-slate-100">Progress Overview</h3>
        <p className="text-slate-400">No subjects added yet. Add subjects in the Manager view to see your progress here.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-slate-100">Progress Overview</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={50} />
            <YAxis stroke="#9ca3af" tickFormatter={(tick) => `${tick}%`} />
            <Tooltip
              cursor={{ fill: 'rgba(71, 85, 105, 0.5)' }}
              contentStyle={{
                backgroundColor: '#1f2937',
                borderColor: '#374151',
                color: '#e5e7eb',
              }}
              labelStyle={{ color: '#d1d5db' }}
            />
            <Legend wrapperStyle={{ color: '#e5e7eb' }}/>
            <Bar dataKey="completion" fill="#22d3ee" name="Completion %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
