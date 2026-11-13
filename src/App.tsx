/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Landing & Auth Pages
import Welcome from './pages/Welcome';
import AdminLogin from './pages/AdminLogin';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';

// Admin Portal Pages & Layout
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import CreateExam from './pages/CreateExam';
import AllExams from './pages/AllExams';
import StudentDetails from './pages/StudentDetails';
import StudentProgress from './pages/StudentProgress';
import AdminResults from './pages/AdminResults';

// Student Portal Pages & Layout
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/StudentDashboard';
import AvailableExams from './pages/AvailableExams';
import AttendExam from './pages/AttendExam';
import ExamResult from './pages/ExamResult';
import StudentProfile from './pages/StudentProfile';

// Assignment Workspace (Preserved Components & Pages)
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ConfirmationModal from './components/ConfirmationModal';
import AssignmentDetailsModal from './components/AssignmentDetailsModal';
import BackendConnectionModal from './components/BackendConnectionModal';
import TakeExamModal from './components/TakeExamModal';
import ToastContainer, { ToastMessage } from './components/Toast';
import Dashboard from './pages/Dashboard';
import AllAssignments from './pages/AllAssignments';
import AddAssignment from './pages/AddAssignment';
import PendingAssignments from './pages/PendingAssignments';
import CompletedAssignments from './pages/CompletedAssignments';
import EditAssignment from './pages/EditAssignment';
import assignmentService from './services/assignmentService';
import { Assignment, AssignmentFormData, StatusType, StudentUser } from './types/assignment';

// Protected Route Helpers with synchronous localStorage fallback
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  let effectiveUser = user;
  if (!effectiveUser) {
    try {
      const stored = localStorage.getItem('exam_sys_user');
      if (stored) effectiveUser = JSON.parse(stored);
    } catch {}
  }
  const effectiveIsAdmin = effectiveUser?.role === 'admin';

  if (!effectiveUser || !effectiveIsAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isStudent } = useAuth();
  let effectiveUser = user;
  if (!effectiveUser) {
    try {
      const stored = localStorage.getItem('exam_sys_user');
      if (stored) effectiveUser = JSON.parse(stored);
    } catch {}
  }
  const effectiveIsStudent = effectiveUser?.role === 'student';

  if (!effectiveUser || !effectiveIsStudent) {
    return <Navigate to="/student/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* 1. Welcome Landing Gateway */}
      <Route path="/" element={<Welcome />} />

      {/* 2. Authentication Pages */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/register" element={<StudentRegister />} />

      {/* 3. Admin / Faculty Portal (Protected) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="create-exam" element={<CreateExam />} />
        <Route path="exams" element={<AllExams />} />
        <Route path="students" element={<StudentDetails />} />
        <Route path="progress" element={<StudentProgress />} />
        <Route path="results" element={<AdminResults />} />
      </Route>

      {/* 4. Student Portal (Protected) */}
      <Route
        path="/student"
        element={
          <StudentRoute>
            <StudentLayout />
          </StudentRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="exams" element={<AvailableExams />} />
        <Route path="results" element={<ExamResult />} />
        <Route path="results/:attemptId" element={<ExamResult />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Dedicated Timed Exam Session View */}
      <Route
        path="/student/exams/:id/take"
        element={
          <StudentRoute>
            <AttendExam />
          </StudentRoute>
        }
      />

      {/* 5. Coursework & Assignment Workspace (Preserved) */}
      <Route path="/assignments/*" element={<AssignmentWorkspaceWrapper />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Sub-app for Coursework & Assignment Tracking
function AssignmentWorkspaceWrapper() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentUser, setCurrentUser] = useState<StudentUser>({
    id: user?.id || 'ST-2024-001',
    studentId: user?.registrationNumber || user?.adminId || 'ST-2024-001',
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex.johnson@student.edu',
    department: user?.department || 'Computer Science & Engineering',
    semester: user?.class || 'Year 3',
    avatarUrl: '',
  });

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbMode, setDbMode] = useState<'mongodb' | 'local_persistent'>('local_persistent');
  const [isMongoConnected, setIsMongoConnected] = useState(false);
  const [mongoHost, setMongoHost] = useState<string | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendModalOpen, setBackendModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<Assignment | null>(null);
  const [takeExamTarget, setTakeExamTarget] = useState<Assignment | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchAssignments = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await assignmentService.getAll();
      setAssignments(data);
    } catch (error: any) {
      addToast('error', error.message || 'Failed to connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const status = await assignmentService.getStatus();
      setDbMode(status.dbMode);
      setIsMongoConnected(status.isMongoConnected);
      setMongoHost(status.mongoHost || null);
    } catch {}
  }, []);

  useEffect(() => {
    fetchAssignments();
    fetchStatus();
  }, [fetchAssignments, fetchStatus]);

  const handleToggleStatus = async (id: string, currentStatus: StatusType) => {
    const newStatus: StatusType = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const updated = await assignmentService.updateStatus(id, newStatus);
      setAssignments((prev) => prev.map((a) => (a._id === id || a.id === id ? updated : a)));
      addToast('success', `Status updated to ${newStatus}`);
    } catch (error: any) {
      addToast('error', error.message || 'Failed to update status.');
    }
  };

  const handleTakeExam = (exam: Assignment) => {
    setTakeExamTarget(exam);
  };

  const handleSubmitExam = async (examId: string, score: number) => {
    try {
      const updated = await assignmentService.update(examId, { status: 'Completed' });
      const updatedItem = { ...updated, score, status: 'Completed' as const };
      setAssignments((prev) => prev.map((a) => (a._id === examId || a.id === examId ? updatedItem : a)));
      addToast('success', `Submitted! Score: ${score}/100`);
    } catch (error: any) {
      addToast('error', error.message || 'Failed to submit exam.');
    }
  };

  const handleAddAssignment = async (formData: AssignmentFormData): Promise<boolean> => {
    try {
      const newAssignment = await assignmentService.create(formData);
      setAssignments((prev) => [newAssignment, ...prev]);
      addToast('success', `Assignment "${newAssignment.title}" scheduled!`);
      return true;
    } catch (error: any) {
      addToast('error', error.message || 'Failed to schedule assignment.');
      return false;
    }
  };

  const handleUpdateAssignment = async (id: string, formData: AssignmentFormData): Promise<boolean> => {
    try {
      const updated = await assignmentService.update(id, formData);
      setAssignments((prev) => prev.map((a) => (a._id === id || a.id === id ? updated : a)));
      addToast('success', `"${updated.title}" updated.`);
      return true;
    } catch (error: any) {
      addToast('error', error.message || 'Failed to update assignment.');
      return false;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget._id || deleteTarget.id!;
    setIsDeleting(true);
    try {
      await assignmentService.delete(targetId);
      setAssignments((prev) => prev.filter((a) => a._id !== targetId && a.id !== targetId));
      addToast('success', `Assignment "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
    } catch (error: any) {
      addToast('error', error.message || 'Failed to delete assignment.');
    } finally {
      setIsDeleting(false);
    }
  };

  const pendingCount = assignments.filter((a) => a.status === 'Pending').length;
  const completedCount = assignments.filter((a) => a.status === 'Completed').length;
  const totalCount = assignments.length;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pendingCount={pendingCount}
        completedCount={completedCount}
        totalCount={totalCount}
        currentUser={currentUser}
        onLogout={() => navigate('/')}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenBackendModal={() => setBackendModalOpen(true)}
          dbMode={dbMode}
          isMongoConnected={isMongoConnected}
          totalPending={pendingCount}
          currentUser={currentUser}
          onLogout={() => navigate('/')}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  assignments={assignments}
                  isLoading={isLoading}
                  currentUser={currentUser}
                  onToggleStatus={handleToggleStatus}
                  onEdit={(a) => navigate(`/assignments/edit/${a._id || a.id}`)}
                  onDelete={(a) => setDeleteTarget(a)}
                  onViewDetails={(a) => setSelectedDetails(a)}
                  onTakeExam={handleTakeExam}
                />
              }
            />
            <Route
              path="/all"
              element={
                <AllAssignments
                  assignments={assignments}
                  isLoading={isLoading}
                  onToggleStatus={handleToggleStatus}
                  onEdit={(a) => navigate(`/assignments/edit/${a._id || a.id}`)}
                  onDelete={(a) => setDeleteTarget(a)}
                  onViewDetails={(a) => setSelectedDetails(a)}
                  onTakeExam={handleTakeExam}
                />
              }
            />
            <Route
              path="/add"
              element={<AddAssignment onAddAssignment={handleAddAssignment} />}
            />
            <Route
              path="/pending"
              element={
                <PendingAssignments
                  assignments={assignments}
                  isLoading={isLoading}
                  onToggleStatus={handleToggleStatus}
                  onEdit={(a) => navigate(`/assignments/edit/${a._id || a.id}`)}
                  onDelete={(a) => setDeleteTarget(a)}
                  onViewDetails={(a) => setSelectedDetails(a)}
                  onTakeExam={handleTakeExam}
                />
              }
            />
            <Route
              path="/completed"
              element={
                <CompletedAssignments
                  assignments={assignments}
                  isLoading={isLoading}
                  onToggleStatus={handleToggleStatus}
                  onEdit={(a) => navigate(`/assignments/edit/${a._id || a.id}`)}
                  onDelete={(a) => setDeleteTarget(a)}
                  onViewDetails={(a) => setSelectedDetails(a)}
                />
              }
            />
            <Route
              path="/edit/:id"
              element={<EditAssignment onUpdateAssignment={handleUpdateAssignment} />}
            />
            <Route path="*" element={<Navigate to="/assignments" replace />} />
          </Routes>
        </main>
      </div>

      <TakeExamModal
        exam={takeExamTarget}
        isOpen={!!takeExamTarget}
        onClose={() => setTakeExamTarget(null)}
        onSubmitExam={handleSubmitExam}
      />

      <ConfirmationModal
        isOpen={!!deleteTarget}
        assignmentTitle={deleteTarget?.title}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <AssignmentDetailsModal
        isOpen={!!selectedDetails}
        assignment={selectedDetails}
        onClose={() => setSelectedDetails(null)}
        onEdit={(a) => navigate(`/assignments/edit/${a._id || a.id}`)}
        onDelete={(a) => setDeleteTarget(a)}
        onToggleStatus={handleToggleStatus}
      />

      <BackendConnectionModal
        isOpen={backendModalOpen}
        onClose={() => setBackendModalOpen(false)}
        isMongoConnected={isMongoConnected}
        dbMode={dbMode}
        mongoHost={mongoHost}
        totalAssignments={assignments.length}
        onStatusChange={() => {
          fetchStatus();
          fetchAssignments();
        }}
        onToast={addToast}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
