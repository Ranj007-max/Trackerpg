import React, { useMemo } from 'react';
import { Subject } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GanttChartViewProps {
  subjects: Subject[];
}

const GanttChartView: React.FC<GanttChartViewProps> = ({ subjects }) => {
  const ganttData = useMemo(() => {
    const allLecturesWithDates = subjects
      .flatMap(s => s.chapters.flatMap(c => c.lectures))
      .filter(l => l.date)
      .map(l => ({ ...l, dateObj: new Date(l.date) }));

    if (allLecturesWithDates.length === 0) {
      return { chartData: [], projectStartDate: null };
    }

    const projectStartDate = new Date(Math.min(...allLecturesWithDates.map(l => l.dateObj.getTime())));
    projectStartDate.setHours(0, 0, 0, 0);

    const chartData = subjects
      .map(subject => {
        const subjectLectures = subject.chapters
          .flatMap(c => c.lectures)
          .filter(l => l.date)
          .map(l => new Date(l.date));

        if (subjectLectures.length === 0) return null;

        const subjectStartDate = new Date(Math.min(...subjectLectures.map(d => d.getTime())));
        const subjectEndDate = new Date(Math.max(...subjectLectures.map(d => d.getTime())));
        subjectStartDate.setHours(0, 0, 0, 0);
        subjectEndDate.setHours(0, 0, 0, 0);

        const dayInMillis = 1000 * 60 * 60 * 24;
        const spacer = Math.floor((subjectStartDate.getTime() - projectStartDate.getTime()) / dayInMillis);
        const duration = Math.floor((subjectEndDate.getTime() - subjectStartDate.getTime()) / dayInMillis) + 1;

        return {
          name: subject.name,
          spacer,
          duration,
          startDateStr: subjectStartDate.toLocaleDateString(),
          endDateStr: subjectEndDate.toLocaleDateString(),
        };
      })
      .filter((d): d is NonNullable<typeof d> => d !== null);

    return { chartData, projectStartDate };
  }, [subjects]);

  if (ganttData.chartData.length === 0) {
    return null; // Don't render anything if there's no data to show
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/80 p-3 rounded-md border border-slate-700 text-sm shadow-lg backdrop-blur-sm">
          <p className="font-bold text-slate-100">{label}</p>
          <p className="text-slate-300">
            Duration: <span className="font-semibold text-white">{data.duration} days</span>
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {data.startDateStr} - {data.endDateStr}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
      <h3 className="text-xl font-semibold text-slate-100 mb-4">Subject Timelines</h3>
      <div style={{ width: '100%', height: ganttData.chartData.length * 50 + 30 }}>
        <ResponsiveContainer>
          <BarChart
            data={ganttData.chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            barCategoryGap="35%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
            <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 12 }} domain={['dataMin', 'dataMax + 5']} />
            <YAxis type="category" dataKey="name" stroke="#9ca3af" width={80} tick={{ fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: 'rgba(71, 85, 105, 0.3)' }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="spacer" stackId="a" fill="transparent" />
            <Bar dataKey="duration" stackId="a" fill="#22d3ee" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GanttChartView;
