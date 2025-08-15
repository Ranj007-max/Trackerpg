export enum LectureStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
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
}

export interface UserProfile {
  name: string;
  targetYear: string;
  mbbsYear: string;
}
