import React, { useState } from 'react';
import {
  X,
  Database,
  Server,
  CheckCircle2,
  AlertCircle,
  Activity,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import assignmentService from '../services/assignmentService.ts';

interface BackendConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMongoConnected: boolean;
  dbMode: 'mongodb' | 'local_persistent';
  mongoHost?: string | null;
  totalAssignments: number;
  onStatusChange: () => void;
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const BackendConnectionModal: React.FC<BackendConnectionModalProps> = ({
  isOpen,
  onClose,
  isMongoConnected,
  dbMode,
  mongoHost,
  totalAssignments,
  onStatusChange,
  onToast,
}) => {
  const [mongoUri, setMongoUri] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  if (!isOpen) return null;

  // Handle testing ping
  const handlePing = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      await assignmentService.getStatus();
      const latency = Math.round(performance.now() - start);
      setPingLatency(latency);
      onToast('success', `Backend response received in ${latency}ms`);
    } catch (err: any) {
      onToast('error', 'Failed to reach backend API');
    } finally {
      setIsPinging(false);
    }
  };

  // Handle connecting to MongoDB
  const handleConnectMongo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mongoUri.trim()) {
      onToast('error', 'Please enter a valid MongoDB connection string.');
      return;
    }

    setIsConnecting(true);
    try {
      const res = await assignmentService.connectMongoDB(mongoUri.trim());
      onToast('success', res.message || 'Connected to MongoDB successfully!');
      onStatusChange();
      setMongoUri('');
    } catch (err: any) {
      onToast('error', err.message || 'Failed to connect to MongoDB cluster.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle disconnecting from MongoDB
  const handleDisconnect = async () => {
    setIsConnecting(true);
    try {
      const res = await assignmentService.disconnectMongoDB();
      onToast('info', res.message || 'Reverted to local persistent database.');
      onStatusChange();
    } catch (err: any) {
      onToast('error', err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const sampleAtlasUri = 'mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/student_workspace?retryWrites=true&w=majority';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleAtlasUri);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              Backend & Database Connection
            </h2>
            <p className="text-xs text-slate-500">
              Live Express.js REST API status and MongoDB connection manager.
            </p>
          </div>
        </div>

        {/* 1. Live Diagnostic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Server status */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Express REST Server
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                Online
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">Port 3000 (Active)</div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>Endpoints: /api/assignments</span>
              <button
                type="button"
                onClick={handlePing}
                disabled={isPinging}
                className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3 h-3" />
                <span>{isPinging ? 'Pinging...' : pingLatency ? `${pingLatency}ms` : 'Ping API'}</span>
              </button>
            </div>
          </div>

          {/* Database status */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Active Storage Engine
              </span>
              <span
                className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full border text-[10px] ${
                  isMongoConnected
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                }`}
              >
                <Database className="w-3 h-3" />
                {isMongoConnected ? 'MongoDB Live' : 'Persistent File DB'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 truncate">
              {isMongoConnected ? mongoHost || 'MongoDB Atlas' : 'Local Persistent Storage'}
            </div>
            <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between font-mono-numbers">
              <span>Saved Records: {totalAssignments} assignments</span>
              <span className="text-emerald-600 font-semibold">Persisting</span>
            </div>
          </div>
        </div>

        {/* 2. MongoDB Connection Form */}
        <div className="p-5 border border-slate-200 rounded-2xl mb-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {isMongoConnected ? 'Connected MongoDB Cluster' : 'Connect Your MongoDB Cluster'}
              </h3>
            </div>
            {isMongoConnected && (
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={isConnecting}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Disconnect MongoDB
              </button>
            )}
          </div>

          {isMongoConnected ? (
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs text-emerald-800">
                <p className="font-bold">Mongoose is currently connected to MongoDB!</p>
                <p className="text-emerald-700">
                  All assignments created, updated, and deleted are executing directly against your MongoDB database.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConnectMongo} className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect your cloud <strong>MongoDB Atlas</strong> database or local MongoDB instance by entering your connection URI below:
              </p>

              <div>
                <input
                  type="text"
                  value={mongoUri}
                  onChange={(e) => setMongoUri(e.target.value)}
                  placeholder="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/student_workspace"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {copiedSample ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSample ? 'Sample URI Copied!' : 'Copy sample Atlas URI format'}</span>
                </button>

                <button
                  type="submit"
                  disabled={isConnecting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
                  <span>{isConnecting ? 'Connecting Mongoose...' : 'Connect to MongoDB'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 3. Guide & Documentation strip */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs text-slate-600">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Out-Of-The-Box Reliability Guarantee</span>
          </div>
          <p className="leading-relaxed">
            The workspace maintains dual persistence. If no external MongoDB URI is supplied, it automatically runs an integrated persistent database store with the exact same Mongoose schema and REST endpoints. All your created assignments and progress survive page reloads and browser restarts.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackendConnectionModal;
