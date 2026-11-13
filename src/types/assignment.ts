export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type StatusType = 'Pending' | 'Completed';
export type AssessmentType = 'Exam' | 'Midterm' | 'Final' | 'Quiz' | 'Assignment';

export interface StudentUser {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  semester: string;
  avatarUrl?: string;
}

export interface ExamQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Assignment {
  _id: string;
  id?: string;
  title: string;
  subject: string;
  description?: string;
  deadline: string; // ISO string / Exam date
  priority: PriorityLevel;
  status: StatusType;
  type?: AssessmentType;
  durationMinutes?: number;
  totalMarks?: number;
  score?: number;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
}

export interface AssignmentFormData {
  title: string;
  subject: string;
  description: string;
  deadline: string;
  priority: PriorityLevel;
  status: StatusType;
  type?: AssessmentType;
  durationMinutes?: number;
  totalMarks?: number;
}

export interface DashboardStats {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  completionRate: number;
  highPriorityPending: number;
}

export interface FilterParams {
  search?: string;
  subject?: string;
  priority?: string;
  status?: string;
  sort?: string;
}
