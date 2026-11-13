import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  GraduationCap,
  Mail,
} from 'lucide-react';
import { examService } from '../services/examService';
import { StudentDirectoryItem } from '../types/system';

export default function StudentDetails() {
  const [students, setStudents] = useState<StudentDirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await examService.getStudentDirectory();
      setStudents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch student directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      departmentFilter === 'All' || s.department.toLowerCase().includes(departmentFilter.toLowerCase());

    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 mb-1">
          <Users className="w-4 h-4" />
          <span>University Student Records</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Details Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Synchronized automatically upon student registration or login from the Student Portal
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, reg no (ST-2024)..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science & Eng</option>
            <option value="Information Technology">Information Tech</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading student directory...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No students found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-4">Student Information</th>
                  <th className="py-3.5 px-4">Registration No</th>
                  <th className="py-3.5 px-4">Department & Class</th>
                  <th className="py-3.5 px-4">Exams Assigned</th>
                  <th className="py-3.5 px-4">Completed</th>
                  <th className="py-3.5 px-4">Overall Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span>{s.email}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-indigo-700">
                      {s.registrationNumber}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-800">{s.department}</div>
                      <div className="text-[11px] text-slate-400">{s.class}</div>
                    </td>

                    <td className="py-4 px-4 font-mono font-semibold text-slate-700">
                      {s.totalExamsAssigned} Exams
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <span className="font-bold text-slate-900">{s.examsCompleted}</span>
                      <span className="text-slate-400"> / {s.totalExamsAssigned}</span>
                    </td>

                    <td className="py-4 px-4">
                      {s.examsCompleted > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-900 font-mono">{s.averageScore}%</span>
                            <span className={s.averageScore >= 50 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                              {s.averageScore >= 50 ? 'Passing' : 'Needs Review'}
                            </span>
                          </div>
                          <div className="w-28 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                s.averageScore >= 70
                                  ? 'bg-emerald-500'
                                  : s.averageScore >= 50
                                  ? 'bg-indigo-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, s.averageScore)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No exams submitted yet</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
