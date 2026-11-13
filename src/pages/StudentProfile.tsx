import React, { useEffect, useState } from 'react';
import { User, Mail, GraduationCap, Award, BookOpen, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { examService } from '../services/examService';
import { ExamAttempt } from '../types/system';

export default function StudentProfile() {
  const { user } = useAuth();
  const [results, setResults] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await examService.getStudentResults();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const totalExams = results.length;
  const passCount = results.filter((r) => r.result === 'Pass').length;
  const avgPct =
    totalExams > 0
      ? Math.round((results.reduce((sum, r) => sum + r.percentage, 0) / totalExams) * 10) / 10
      : 0;

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center space-x-2 text-xs font-semibold text-purple-600 mb-1">
          <User className="w-4 h-4" />
          <span>Student Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Academic Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Permanent student registration records and examination dossier
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-purple-600/20">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1 font-mono">
              <span className="font-bold text-purple-700">{user?.registrationNumber}</span>
              <span>•</span>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Department</span>
            <div className="font-bold text-slate-800 text-sm">{user?.department || 'Computer Science & Engineering'}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Class / Semester</span>
            <div className="font-bold text-slate-800 text-sm">{user?.class || 'Year 3 (Section A)'}</div>
          </div>
        </div>

        {/* Academic Stats */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Academic Performance Summary
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="text-xl font-extrabold text-slate-900 font-mono">{totalExams}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Tests Completed</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <div className="text-xl font-extrabold text-emerald-600 font-mono">{passCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Tests Passed</div>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <div className="text-xl font-extrabold text-indigo-600 font-mono">{avgPct}%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Average Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
