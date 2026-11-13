import api from './api';
import {
  Exam,
  AdminDashboardStats,
  StudentDashboardStats,
  StudentProgressRecord,
  StudentDirectoryItem,
  ExamAttempt,
} from '../types/system';

export const examService = {
  // Admin Endpoints
  async getAdminDashboard(): Promise<{
    stats: AdminDashboardStats;
    recentSubmissions: any[];
    activeExamsList: Exam[];
  }> {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  async getAllAdminExams(): Promise<Exam[]> {
    const res = await api.get('/admin/exams');
    return res.data.exams;
  },

  async getAdminExam(id: string): Promise<Exam> {
    const res = await api.get(`/admin/exams/${id}`);
    return res.data.exam;
  },

  async createExam(data: any): Promise<{ exam: Exam; message: string }> {
    const res = await api.post('/admin/exams', data);
    return res.data;
  },

  async updateAdminExam(id: string, data: any): Promise<{ exam: Exam; message: string }> {
    const res = await api.put(`/admin/exams/${id}`, data);
    return res.data;
  },

  async publishExam(id: string, status: 'Published' | 'Draft' | 'Closed'): Promise<{ exam: Exam; message: string }> {
    const res = await api.patch(`/admin/exams/${id}/publish`, { status });
    return res.data;
  },

  async deleteAdminExam(id: string): Promise<void> {
    await api.delete(`/admin/exams/${id}`);
  },

  async getStudentDirectory(): Promise<StudentDirectoryItem[]> {
    const res = await api.get('/admin/students');
    return res.data.students;
  },

  async getStudentProgress(): Promise<StudentProgressRecord[]> {
    const res = await api.get('/admin/progress');
    return res.data.progress;
  },

  async getAdminResults(): Promise<ExamAttempt[]> {
    const res = await api.get('/admin/results');
    return res.data.results;
  },

  // Student Endpoints
  async getStudentDashboard(): Promise<{ stats: StudentDashboardStats; exams: Exam[] }> {
    const res = await api.get('/student/dashboard');
    return res.data;
  },

  async getAvailableExams(): Promise<Exam[]> {
    const res = await api.get('/student/exams');
    return res.data.exams;
  },

  async getStudentExamForAttempt(id: string): Promise<{ exam: Exam }> {
    const res = await api.get(`/student/exams/${id}`);
    return res.data;
  },

  async startExam(id: string): Promise<{ attempt: ExamAttempt; message: string }> {
    const res = await api.post(`/student/exams/${id}/start`);
    return res.data;
  },

  async submitExam(
    id: string,
    answers: { questionId: string; selectedOption: string | null }[],
    timeTakenSeconds: number
  ): Promise<any> {
    const res = await api.post(`/student/exams/${id}/submit`, { answers, timeTakenSeconds });
    return res.data;
  },

  async getStudentResults(): Promise<ExamAttempt[]> {
    const res = await api.get('/student/results');
    return res.data.results;
  },

  async getStudentResultDetail(attemptId: string): Promise<ExamAttempt> {
    const res = await api.get(`/student/results/${attemptId}`);
    return res.data.result;
  },

  async reseedSystem(): Promise<void> {
    await api.post('/system/reseed');
  },
};
