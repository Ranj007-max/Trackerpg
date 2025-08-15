import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Subject, LectureStatus } from '../types';

interface ActivityChartProps {
  subjects: Subject[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ subjects }) => {
  const data = useMemo(() => {
    const activity = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Initialize the map for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      activity.set(dateString, 0);
    }

    // Get all lectures
    const allLectures = subjects.flatMap(subject =>
      subject.chapters.flatMap(chapter => chapter.lectures)
    );

    // Count completed lectures for each day
    allLectures.forEach(lecture => {
      if (lecture.status === LectureStatus.Completed && lecture.date) {
        try {
          const lectureDate = new Date(lecture.date);
          lectureDate.setHours(0, 0, 0, 0); // Normalize date
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 29);

          if (lectureDate >= thirtyDaysAgo && lectureDate <= today) {
            const dateString = lectureDate.toISOString().split('T')[0];
            if (activity.has(dateString)) {
              activity.set(dateString, activity.get(dateString)! + 1);
            }
          }
        } catch (e) {
            // Ignore invalid dates
        }
      }
    });

    // Convert map to array and sort by date
    return Array.from(activity.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  }, [subjects]);

  const hasActivity = data.some(d => d.count > 0);

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-slate-100">Daily Lecture Activity (Last 30 Days)</h3>
      <div style={{ width: '100%', height: 300 }}>
        {hasActivity ? (
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fontSize: 10 }}
                tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#9ca3af" allowDecimals={false} />
              <Tooltip
                cursor={{ fill: 'rgba(71, 85, 105, 0.5)' }}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  borderColor: '#374151',
                  color: '#e5e7eb',
                }}
                labelStyle={{ color: '#d1d5db' }}
                formatter={(value: number) => [`${value} lectures`, 'Completed']}
              />
              <Bar dataKey="count" fill="#8884d8" name="Lectures Completed" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400">No completed lectures in the last 30 days.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityChart;
