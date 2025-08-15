export enum LectureStatus {
  NotStarted = 'Not Started',
  Started = 'Started',
  Completed = 'Completed',
  Revision = 'Revision',
}

export interface Lecture {
  id: string;
  name: string;
  date: string;
  platform: string;
  faculty: string;
  status: LectureStatus;
}

export interface Chapter {
  id: string;
  name: string;
  lectures: Lecture[];
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
  totalLectures?: number;
}

export interface UserProfile {
  name: string;
  targetYear: string;
  mbbsYear: string;
}
