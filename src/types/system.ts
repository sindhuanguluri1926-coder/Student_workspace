export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  adminId?: string;
  registrationNumber?: string;
  department?: string;
  class?: string;
}

export interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer?: 'A' | 'B' | 'C' | 'D';
  marks: number;
}

export interface Exam {
  id: string;
  _id?: string;
  title: string;
  subject: string;
  description: string;
  instructions: string;
  duration: number; // in minutes
  totalMarks: number;
  assignedClass: string;
  startDate?: string;
  endDate: string;
  status: 'Draft' | 'Published' | 'Closed';
  createdBy?: string;
  questions?: Question[];
  questionsCount?: number;
  submissionCount?: number;
  averageScore?: number;
  // Student-specific fields when returned in student list
  attemptStatus?: 'Not Started' | 'In Progress' | 'Submitted';
  score?: number | null;
  percentage?: number | null;
  result?: 'Pass' | 'Fail' | null;
  isCompleted?: boolean;
  isLocked?: boolean;
  attemptId?: string | null;
}

export interface GradedAnswer {
  questionId: string;
  questionText?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  correctAnswer?: string;
  isCorrect: boolean;
  marksAwarded: number;
  totalMarks?: number;
}

export interface ExamAttempt {
  id: string;
  _id?: string;
  studentId: string;
  registrationNumber: string;
  studentName: string;
  examId: string;
  examTitle: string;
  subject: string;
  score: number;
  totalMarks: number;
  percentage: number;
  result: 'Pass' | 'Fail' | 'Pending';
  status: 'Not Started' | 'In Progress' | 'Submitted';
  timeTakenSeconds: number;
  startedAt?: string;
  submittedAt?: string;
  answers?: GradedAnswer[];
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalExams: number;
  activeExams: number;
  completedAttempts: number;
  pendingAttempts: number;
  averageScore: number;
  passRate: number;
}

export interface StudentDashboardStats {
  totalAssigned: number;
  completedCount: number;
  pendingCount: number;
  avgPercentage: number;
}

export interface StudentProgressRecord {
  id: string;
  attemptId?: string | null;
  studentId: string;
  studentName: string;
  registrationNumber: string;
  department: string;
  class: string;
  examId: string;
  examTitle: string;
  subject: string;
  status: 'Not Started' | 'In Progress' | 'Submitted';
  score: number;
  totalMarks: number;
  percentage: number;
  result: 'Pass' | 'Fail' | 'Pending';
  timeTakenSeconds: number;
  submittedAt?: string | null;
}

export interface StudentDirectoryItem {
  id: string;
  name: string;
  registrationNumber: string;
  email: string;
  department: string;
  class: string;
  totalExamsAssigned: number;
  examsCompleted: number;
  averageScore: number;
  createdAt: string;
}
