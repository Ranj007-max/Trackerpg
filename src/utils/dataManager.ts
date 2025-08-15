import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Subject, UserProfile, LectureStatus } from '../types';

export const downloadDataAsJson = (data: Subject[], fileName: string = 'trackerpg_data.json') => {
  const jsonString = `data:text/json;charset=utf-t,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = fileName;
  link.click();
};

export const uploadDataFromJson = (file: File): Promise<Subject[]> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const parsedData = JSON.parse(result) as Subject[];
          // Basic validation can be added here
          resolve(parsedData);
        } else {
          reject(new Error("File content is not a string."));
        }
      } catch (error) {
        reject(new Error("Error parsing JSON file."));
      }
    };
    fileReader.onerror = error => reject(error);
    fileReader.readAsText(file);
  });
};

export const downloadDataAsPdf = (subjects: Subject[], profile: UserProfile, fileName: string = 'trackerpg_progress.pdf') => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text("NEET PG Preparation Report", 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Student: ${profile.name || 'N/A'}`, 14, 30);
  doc.text(`Target Year: ${profile.targetYear || 'N/A'}`, 14, 36);
  doc.text(`Current Year: ${profile.mbbsYear || 'N/A'}`, 14, 42);
  doc.line(14, 45, 196, 45); // horizontal line

  // Lecture Summary
  let totalLectures = 0;
  let completedLectures = 0;
  subjects.forEach(subject => {
      subject.chapters.forEach(chapter => {
          totalLectures += chapter.lectures.length;
          completedLectures += chapter.lectures.filter(l => l.status === LectureStatus.Completed || l.status === LectureStatus.Revision).length;
      });
  });
  const overallPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

  doc.setFontSize(16);
  doc.text("Lecture Progress", 105, 55, { align: 'center' });
  (doc as any).autoTable({
    startY: 60,
    head: [['Metric', 'Value']],
    body: [
      ['Total Subjects Tracked', subjects.length],
      ['Total Lectures', totalLectures],
      ['Completed Lectures', completedLectures],
      ['Overall Completion', `${overallPercentage}%`]
    ],
    theme: 'striped',
    headStyles: { fillColor: [8, 145, 178] } // cyan-600
  });

  // QBank Summary
  let totalQBankQuestions = 0;
  let solvedQBankQuestions = 0;
  subjects.forEach(subject => {
    if (subject.qbank) {
        totalQBankQuestions += subject.qbank.totalQuestions || 0;
        solvedQBankQuestions += subject.qbank.solvedQuestions || 0;
    }
  });

  if (totalQBankQuestions > 0) {
    const qbankPercentage = Math.round((solvedQBankQuestions / totalQBankQuestions) * 100);
    let finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(16);
    doc.text("QBank Progress", 105, finalY + 15, { align: 'center' });
    (doc as any).autoTable({
        startY: finalY + 20,
        head: [['Metric', 'Value']],
        body: [
            ['Total Questions', totalQBankQuestions],
            ['Solved Questions', solvedQBankQuestions],
            ['Overall Completion', `${qbankPercentage}%`]
        ],
        theme: 'striped',
        headStyles: { fillColor: [202, 138, 4] } // amber-600
    });
  }

  // Subject-wise details
  let finalY = (doc as any).lastAutoTable.finalY || 100;

  subjects.forEach((subject) => {
    let subjectLectures = 0;
    let subjectCompleted = 0;
    const chapterData = subject.chapters.map(chapter => {
      const chapterTotal = chapter.lectures.length;
      const chapterCompleted = chapter.lectures.filter(l => l.status === LectureStatus.Completed || l.status === LectureStatus.Revision).length;
      subjectLectures += chapterTotal;
      subjectCompleted += chapterCompleted;
      const chapterProgress = chapterTotal > 0 ? `${Math.round((chapterCompleted / chapterTotal) * 100)}%` : '0%';
      return [chapter.name, chapterTotal, chapterCompleted, chapterProgress];
    });

    const targetLectures = subject.totalLectures || subjectLectures;
    const subjectProgress = targetLectures > 0 ? `${Math.round((subjectCompleted / targetLectures) * 100)}%` : '0%';
    const qbankProgressText = subject.qbank && subject.qbank.totalQuestions > 0 
        ? ` | QBank: ${Math.round((subject.qbank.solvedQuestions / subject.qbank.totalQuestions) * 100)}%` 
        : '';
    
    const requiredSpace = (chapterData.length * 10) + 25; // Estimate space needed
    if (finalY + requiredSpace > doc.internal.pageSize.height - 20) {
      doc.addPage();
      finalY = 20;
    } else {
      finalY += 15;
    }

    (doc as any).autoTable({
        startY: finalY,
        head: [[`${subject.name} - Lectures: ${subjectProgress}${qbankProgressText}`]],
        headStyles: { fillColor: [51, 65, 85] }, // slate-700
        body: [],
    });
    (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY,
        head: [['Chapter', 'Total Lectures', 'Completed', 'Progress']],
        body: chapterData,
        theme: 'grid',
        didDrawPage: (data: any) => {
          finalY = data.cursor.y;
        }
    });
  });

  doc.save(fileName);
};