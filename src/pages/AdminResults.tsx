import React, { useEffect, useState } from 'react';
import {
  Award,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Calendar,
  FileText,
} from 'lucide-react';
import { examService } from '../services/examService';
import { ExamAttempt } from '../types/system';

export default function AdminResults() {
  const [results, setResults] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState('All');

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await examService.getAdminResults();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch examination results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const filteredResults = results.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.examTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesResult = resultFilter === 'All' || r.result === resultFilter;

    return matchesSearch && matchesResult;
  });

  const totalCompleted = results.length;
  const passCount = results.filter((r) => r.result === 'Pass').length;
  const avgPct =
    totalCompleted > 0
      ? Math.round((results.reduce((sum, r) => sum + r.percentage, 0) / totalCompleted) * 10) / 10
      : 0;

  const handleExportCSV = () => {
    if (results.length === 0) return;
    const headers = ['Student Name', 'Registration No', 'Exam Title', 'Score', 'Total Marks', 'Percentage', 'Result', 'Submitted Date'];
    const rows = filteredResults.map((r) => [
      `"${r.studentName}"`,
      `"${r.registrationNumber}"`,
      `"${r.examTitle}"`,
      r.score,
      r.totalMarks,
      `${r.percentage}%`,
      r.result,
      `"${new Date(r.submittedAt || '').toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `exam_results_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 mb-1">
            <Award className="w-4 h-4" />
            <span>Academic Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Examination Results Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Permanent record of graded submissions and academic achievement
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredResults.length === 0}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Submissions</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{totalCompleted}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Pass Rate</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
            {totalCompleted > 0 ? `${Math.round((passCount / totalCompleted) * 100)}%` : '—'}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs text-indigo-700 font-bold uppercase tracking-wider">Average Score</div>
          <div className="text-2xl font-extrabold text-indigo-600 font-mono mt-1">{avgPct}%</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, reg no, or exam..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="All">All Results</option>
            <option value="Pass">Pass Only</option>
            <option value="Fail">Fail Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading results ledger...</div>
        ) : filteredResults.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No exam results recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Registration No</th>
                  <th className="py-3.5 px-4">Exam Title</th>
                  <th className="py-3.5 px-4">Score Awarded</th>
                  <th className="py-3.5 px-4">Percentage</th>
                  <th className="py-3.5 px-4">Result</th>
                  <th className="py-3.5 px-4">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredResults.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">{r.studentName}</td>
                    <td className="py-4 px-4 font-mono font-semibold text-indigo-700">
                      {r.registrationNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{r.examTitle}</div>
                      <div className="text-[11px] text-slate-400">{r.subject}</div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      {r.score} / {r.totalMarks}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-indigo-600">
                      {r.percentage}%
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          r.result === 'Pass'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {r.result}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                      {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : '—'}
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
