import api from './api.ts';
import { Assignment, AssignmentFormData, FilterParams, StatusType } from '../types/assignment.ts';

export const assignmentService = {
  /**
   * Fetch all assignments with optional search, filter, and sort
   */
  async getAll(params?: FilterParams): Promise<Assignment[]> {
    const response = await api.get<{ success: boolean; data: Assignment[]; count: number }>(
      '/assignments',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get single assignment by ID
   */
  async getById(id: string): Promise<Assignment> {
    const response = await api.get<{ success: boolean; data: Assignment }>(`/assignments/${id}`);
    return response.data.data;
  },

  /**
   * Create new assignment
   */
  async create(data: AssignmentFormData): Promise<Assignment> {
    const response = await api.post<{ success: boolean; data: Assignment; message: string }>(
      '/assignments',
      data
    );
    return response.data.data;
  },

  /**
   * Update assignment details
   */
  async update(id: string, data: Partial<AssignmentFormData>): Promise<Assignment> {
    const response = await api.put<{ success: boolean; data: Assignment; message: string }>(
      `/assignments/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete assignment
   */
  async delete(id: string): Promise<void> {
    await api.delete<{ success: boolean; message: string }>(`/assignments/${id}`);
  },

  /**
   * Update status directly (Pending <-> Completed)
   */
  async updateStatus(id: string, status: StatusType): Promise<Assignment> {
    const response = await api.patch<{ success: boolean; data: Assignment; message: string }>(
      `/assignments/${id}/status`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Get server/database status
   */
  async getStatus(): Promise<{
    status: string;
    appName: string;
    dbMode: 'mongodb' | 'local_persistent';
    isMongoConnected: boolean;
    mongoHost?: string | null;
    totalAssignments: number;
    uptimeSeconds?: number;
    timestamp: string;
    endpoints?: string[];
  }> {
    const response = await api.get('/status');
    return response.data;
  },

  /**
   * Connect to custom MongoDB cluster
   */
  async connectMongoDB(uri: string): Promise<{
    success: boolean;
    message: string;
    mongoHost: string;
    totalAssignments: number;
  }> {
    const response = await api.post('/connect-db', { uri });
    return response.data;
  },

  /**
   * Disconnect from MongoDB
   */
  async disconnectMongoDB(): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/disconnect-db');
    return response.data;
  },

  /**
   * Reset sample assignments
   */
  async resetSeeds(): Promise<void> {
    await api.post('/assignments/seed');
  },
};

export default assignmentService;
