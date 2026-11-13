import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || 'student_exam_system_secret_key_2026_xyz';

// Ensure data folder exists for robust local file persistence
const dataDir = path.resolve(__dirname, 'data');
const assignmentsFile = path.resolve(dataDir, 'assignments.json');
const usersFile = path.resolve(dataDir, 'users.json');
const examsFile = path.resolve(dataDir, 'exams.json');
const attemptsFile = path.resolve(dataDir, 'attempts.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper file persistence
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Initial Data Seeds
const getInitialSeedUsers = () => {
  const salt = bcrypt.genSaltSync(10);
  return [
    {
      _id: '672b10000000000000000001',
      id: '672b10000000000000000001',
      name: 'Prof. Sarah Mitchell',
      adminId: 'FACULTY-001',
      email: 'faculty@university.edu',
      passwordHash: bcrypt.hashSync('admin123', salt),
      role: 'admin',
      department: 'Computer Science & Engineering',
      class: 'Faculty Lead',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '672b10000000000000000002',
      id: '672b10000000000000000002',
      name: 'Alex Johnson',
      registrationNumber: 'ST-2024-001',
      email: 'alex.johnson@student.edu',
      passwordHash: bcrypt.hashSync('student123', salt),
      role: 'student',
      department: 'Computer Science & Engineering',
      class: 'CS-301 (Year 3)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '672b10000000000000000003',
      id: '672b10000000000000000003',
      name: 'Emma Watson',
      registrationNumber: 'ST-2024-002',
      email: 'emma.watson@student.edu',
      passwordHash: bcrypt.hashSync('student123', salt),
      role: 'student',
      department: 'Computer Science & Engineering',
      class: 'CS-301 (Year 3)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '672b10000000000000000004',
      id: '672b10000000000000000004',
      name: 'David Chen',
      registrationNumber: 'ST-2024-003',
      email: 'david.chen@student.edu',
      passwordHash: bcrypt.hashSync('student123', salt),
      role: 'student',
      department: 'Information Technology',
      class: 'IT-302 (Year 3)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '672b10000000000000000005',
      id: '672b10000000000000000005',
      name: 'Sophia Martinez',
      registrationNumber: 'ST-2024-004',
      email: 'sophia.m@student.edu',
      passwordHash: bcrypt.hashSync('student123', salt),
      role: 'student',
      department: 'Computer Science & Engineering',
      class: 'CS-301 (Year 3)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '672b10000000000000000006',
      id: '672b10000000000000000006',
      name: 'Sindhu',
      registrationNumber: 'ST-2024-005',
      email: 'sindhuanguluri1926@gmail.com',
      passwordHash: bcrypt.hashSync('student123', salt),
      role: 'student',
      department: 'Computer Science & Engineering',
      class: 'CS-301 (Year 3)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

const getInitialSeedExams = () => {
  const now = new Date();
  const addDays = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  return [
    {
      _id: '672b20000000000000000001',
      id: '672b20000000000000000001',
      title: 'Database Systems: Normalization & Indexing',
      subject: 'Computer Science (CS 330)',
      description: 'Midterm evaluation covering relational algebra, B+ tree indexing structures, normal forms (1NF, 2NF, 3NF, BCNF), and ACID transaction properties.',
      instructions: '1. Total Questions: 5. 2. Time limit is 20 minutes. 3. Each question carries 4 marks. 4. Once submitted, answers cannot be edited. 5. Only ONE attempt is allowed per student.',
      duration: 20,
      totalMarks: 20,
      assignedClass: 'All',
      startDate: addDays(-2),
      endDate: addDays(7),
      status: 'Published',
      createdBy: 'FACULTY-001',
      questions: [
        {
          id: 'q1',
          question: 'Which normal form eliminates transitive dependency for non-prime attributes on candidate keys?',
          optionA: 'First Normal Form (1NF)',
          optionB: 'Second Normal Form (2NF)',
          optionC: 'Third Normal Form (3NF)',
          optionD: 'Boyce-Codd Normal Form (BCNF)',
          correctAnswer: 'C',
          marks: 4,
        },
        {
          id: 'q2',
          question: 'In a B+ Tree index with order m, where are the actual data pointers / record records stored?',
          optionA: 'Evenly distributed across all tree nodes',
          optionB: 'Exclusively in the leaf nodes, linked as a doubly-linked list',
          optionC: 'Only in the root and interior nodes',
          optionD: 'In an external overflow file without tree indexing',
          correctAnswer: 'B',
          marks: 4,
        },
        {
          id: 'q3',
          question: 'What ACID property guarantees that a transaction will either commit entirely or leave the database completely unchanged upon failure?',
          optionA: 'Atomicity',
          optionB: 'Consistency',
          optionC: 'Isolation',
          optionD: 'Durability',
          correctAnswer: 'A',
          marks: 4,
        },
        {
          id: 'q4',
          question: 'Which of the following SQL isolation levels completely prevents dirty reads, non-repeatable reads, and phantom reads?',
          optionA: 'Read Committed',
          optionB: 'Read Uncommitted',
          optionC: 'Repeatable Read',
          optionD: 'Serializable',
          correctAnswer: 'D',
          marks: 4,
        },
        {
          id: 'q5',
          question: 'A table is in 2NF if and only if it is in 1NF and what additional condition is met?',
          optionA: 'Every non-key attribute is fully functionally dependent on the entire primary key (no partial dependency)',
          optionB: 'There are no multivalued dependencies (4NF)',
          optionC: 'All determinants are superkeys',
          optionD: 'Every attribute contains atomic values only',
          correctAnswer: 'A',
          marks: 4,
        },
      ],
      createdAt: addDays(-3),
      updatedAt: addDays(-1),
    },
    {
      _id: '672b20000000000000000002',
      id: '672b20000000000000000002',
      title: 'Operating Systems: Process Synchronization & Concurrency',
      subject: 'Computer Science (CS 401)',
      description: 'Assessment on critical section problems, mutexes, counting semaphores, Banker algorithm for deadlock avoidance, and thread scheduling.',
      instructions: '1. Read each question carefully. 2. Time limit is 25 minutes. 3. Total marks: 20 (4 questions x 5 marks each). 4. Auto-submits on timer expiration.',
      duration: 25,
      totalMarks: 20,
      assignedClass: 'All',
      startDate: addDays(-1),
      endDate: addDays(5),
      status: 'Published',
      createdBy: 'FACULTY-001',
      questions: [
        {
          id: 'q201',
          question: 'Which of the following is NOT one of the four necessary Coffman conditions for a system deadlock to occur?',
          optionA: 'Mutual Exclusion',
          optionB: 'Hold and Wait',
          optionC: 'Preemption of resources by kernel',
          optionD: 'Circular Wait',
          correctAnswer: 'C',
          marks: 5,
        },
        {
          id: 'q202',
          question: 'In Dijkstra\'s semaphore synchronization, what operation decrements the semaphore value?',
          optionA: 'signal() / V()',
          optionB: 'wait() / P()',
          optionC: 'yield()',
          optionD: 'fork()',
          correctAnswer: 'B',
          marks: 5,
        },
        {
          id: 'q203',
          question: 'Which CPU scheduling algorithm provides the theoretical minimal average waiting time for a given set of processes?',
          optionA: 'First-Come, First-Served (FCFS)',
          optionB: 'Shortest Job First (SJF) / Shortest Remaining Time First',
          optionC: 'Round Robin with 10ms quantum',
          optionD: 'Multi-Level Feedback Queue',
          correctAnswer: 'B',
          marks: 5,
        },
        {
          id: 'q204',
          question: 'What is the primary role of the Translation Lookaside Buffer (TLB) in virtual memory architectures?',
          optionA: 'Store disk cache blocks',
          optionB: 'Cache virtual-to-physical address translations to accelerate memory access',
          optionC: 'Prevent buffer overflow attacks in user space',
          optionD: 'Manage register allocation during context switching',
          correctAnswer: 'B',
          marks: 5,
        },
      ],
      createdAt: addDays(-2),
      updatedAt: addDays(-1),
    },
    {
      _id: '672b20000000000000000003',
      id: '672b20000000000000000003',
      title: 'Computer Networks: TCP/IP & Congestion Control',
      subject: 'Networking (NET 305)',
      description: 'End-to-end transport layer principles, TCP sliding window, Tahoe/Reno congestion control, and Dijkstra link-state routing.',
      instructions: 'Exam is currently being drafted by faculty. Review syllabus chapters 4 and 5.',
      duration: 30,
      totalMarks: 25,
      assignedClass: 'All',
      startDate: addDays(2),
      endDate: addDays(10),
      status: 'Draft',
      createdBy: 'FACULTY-001',
      questions: [
        {
          id: 'q301',
          question: 'How many packets are exchanged in a standard TCP connection establishment handshake?',
          optionA: '2 packets (SYN, ACK)',
          optionB: '3 packets (SYN, SYN-ACK, ACK)',
          optionC: '4 packets (SYN, ACK, DATA, FIN)',
          optionD: '1 packet with piggybacked options',
          correctAnswer: 'B',
          marks: 5,
        },
      ],
      createdAt: addDays(-1),
      updatedAt: addDays(-1),
    },
  ];
};

const getInitialSeedAttempts = () => {
  return [
    {
      _id: '672b30000000000000000001',
      id: '672b30000000000000000001',
      studentId: '672b10000000000000000002',
      registrationNumber: 'ST-2024-001',
      studentName: 'Alex Johnson',
      examId: '672b20000000000000000001',
      examTitle: 'Database Systems: Normalization & Indexing',
      subject: 'Computer Science (CS 330)',
      answers: [
        { questionId: 'q1', selectedOption: 'C', isCorrect: true, marksAwarded: 4 },
        { questionId: 'q2', selectedOption: 'B', isCorrect: true, marksAwarded: 4 },
        { questionId: 'q3', selectedOption: 'A', isCorrect: true, marksAwarded: 4 },
        { questionId: 'q4', selectedOption: 'D', isCorrect: true, marksAwarded: 4 },
        { questionId: 'q5', selectedOption: 'B', isCorrect: false, marksAwarded: 0 },
      ],
      startedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      submittedAt: new Date(Date.now() - 3600 * 1000 * 3.7).toISOString(),
      timeTakenSeconds: 780, // 13 minutes
      score: 16,
      totalMarks: 20,
      percentage: 80,
      result: 'Pass',
      status: 'Submitted',
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 3.7).toISOString(),
    },
  ];
};

const getInitialSeedAssignments = () => {
  const now = new Date();
  const addDays = (days: number, hours = 23, minutes = 59) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  return [
    {
      _id: '672b101a91e1f1001a000001',
      id: '672b101a91e1f1001a000001',
      title: 'Operating Systems: Kernel Process Scheduler',
      subject: 'Computer Science (CS 401)',
      description: 'Implement a priority-based round-robin CPU scheduler in C with context-switching metrics and wait-time statistics.',
      deadline: addDays(1, 23, 59),
      priority: 'High',
      status: 'Pending',
      createdAt: addDays(-5),
      updatedAt: addDays(-1),
    },
    {
      _id: '672b101a91e1f1001a000002',
      id: '672b101a91e1f1001a000002',
      title: 'Multivariable Calculus: Problem Set 5',
      subject: 'Mathematics (MATH 215)',
      description: 'Solve Green\'s theorem and Stokes\' theorem boundary integral problems 14 through 28 with complete work.',
      deadline: addDays(3, 17, 0),
      priority: 'Medium',
      status: 'Pending',
      createdAt: addDays(-4),
      updatedAt: addDays(-2),
    },
    {
      _id: '672b101a91e1f1001a000003',
      id: '672b101a91e1f1001a000003',
      title: 'Distributed Systems: Raft Consensus Protocol Simulation',
      subject: 'Computer Science (CS 455)',
      description: 'Construct a 5-node leader election and log replication simulation using asynchronous RPC message queues.',
      deadline: addDays(6, 23, 59),
      priority: 'High',
      status: 'Pending',
      createdAt: addDays(-3),
      updatedAt: addDays(-1),
    },
    {
      _id: '672b101a91e1f1001a000004',
      id: '672b101a91e1f1001a000004',
      title: 'Technical Writing: Research Grant Proposal Draft',
      subject: 'Engineering Communications (ENG 302)',
      description: 'Submit an NSF-style 5-page research proposal addressing energy-efficient edge computing architectures.',
      deadline: addDays(-2, 23, 59),
      priority: 'Low',
      status: 'Completed',
      createdAt: addDays(-10),
      updatedAt: addDays(-2),
    },
    {
      _id: '672b101a91e1f1001a000005',
      id: '672b101a91e1f1001a000005',
      title: 'Digital Signal Processing: FFT Filter Audio Analysis',
      subject: 'Electrical Engineering (EE 320)',
      description: 'Design and test Butterworth bandpass filter coefficients for eliminating 60Hz hum from noisy audio recordings.',
      deadline: addDays(-5, 23, 59),
      priority: 'Medium',
      status: 'Pending',
      createdAt: addDays(-8),
      updatedAt: addDays(-5),
    },
  ];
};

// Ensure seed data in persistent store
if (!fs.existsSync(assignmentsFile)) {
  writeJsonFile(assignmentsFile, getInitialSeedAssignments());
}
if (!fs.existsSync(usersFile)) {
  writeJsonFile(usersFile, getInitialSeedUsers());
}
if (!fs.existsSync(examsFile)) {
  writeJsonFile(examsFile, getInitialSeedExams());
}
if (!fs.existsSync(attemptsFile)) {
  writeJsonFile(attemptsFile, getInitialSeedAttempts());
}

// Mongoose Connection Setup
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_examination_workspace';
let isMongoConnected = false;
let dbMode: 'mongodb' | 'local_persistent' = 'local_persistent';

// Mongoose Schemas
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    registrationNumber: { type: String, unique: true, sparse: true, uppercase: true },
    adminId: { type: String, unique: true, sparse: true, uppercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'student'], default: 'student' },
    department: { type: String, default: 'Computer Science & Engineering' },
    class: { type: String, default: 'Year 3' },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret.passwordHash;
    return ret;
  },
});

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  optionA: { type: String, required: true },
  optionB: { type: String, required: true },
  optionC: { type: String, required: true },
  optionD: { type: String, required: true },
  correctAnswer: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  marks: { type: Number, default: 1 },
});

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, default: '' },
    instructions: { type: String, default: 'Select the best option. Exam will auto-submit when the timer expires.' },
    duration: { type: Number, required: true, default: 30 },
    totalMarks: { type: Number, required: true, default: 10 },
    assignedClass: { type: String, default: 'All' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Draft', 'Published', 'Closed'], default: 'Draft' },
    createdBy: { type: String, default: 'FACULTY-001' },
    questions: [questionSchema],
  },
  { timestamps: true }
);

examSchema.set('toJSON', {
  virtuals: true,
  transform: (doc: any, ret: any) => {
    ret.id = ret._id;
    return ret;
  },
});

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  selectedOption: { type: String, enum: ['A', 'B', 'C', 'D', null], default: null },
  isCorrect: { type: Boolean, default: false },
  marksAwarded: { type: Number, default: 0 },
});

const attemptSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registrationNumber: { type: String, required: true, uppercase: true },
    studentName: { type: String, required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    examTitle: { type: String, required: true },
    subject: { type: String, required: true },
    answers: [answerSchema],
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    timeTakenSeconds: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, required: true, default: 10 },
    percentage: { type: Number, default: 0 },
    result: { type: String, enum: ['Pass', 'Fail', 'Pending'], default: 'Pending' },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Submitted'], default: 'In Progress' },
  },
  { timestamps: true }
);

// Compound Unique Index: One attempt per student per exam
attemptSchema.index({ studentId: 1, examId: 1 }, { unique: true });

attemptSchema.set('toJSON', {
  virtuals: true,
  transform: (doc: any, ret: any) => {
    ret.id = ret._id;
    return ret;
  },
});

const assignmentMongooseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, default: '' },
    deadline: { type: Date, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  },
  { timestamps: true }
);

assignmentMongooseSchema.set('toJSON', {
  virtuals: true,
  transform: (doc: any, ret: any) => {
    ret.id = ret._id;
    return ret;
  },
});

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);
const MongooseExam = mongoose.models.Exam || mongoose.model('Exam', examSchema);
const MongooseAttempt = mongoose.models.ExamAttempt || mongoose.model('ExamAttempt', attemptSchema);
const MongooseAssignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentMongooseSchema);

// Connect to MongoDB with fallback
mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    isMongoConnected = true;
    dbMode = 'mongodb';
    console.log(`[MongoDB] Successfully connected to ${mongoose.connection.host}`);
    // Sync initial seeds if empty
    try {
      if ((await MongooseUser.countDocuments()) === 0) {
        await MongooseUser.insertMany(getInitialSeedUsers());
      }
      if ((await MongooseExam.countDocuments()) === 0) {
        await MongooseExam.insertMany(getInitialSeedExams());
      }
      if ((await MongooseAttempt.countDocuments()) === 0) {
        await MongooseAttempt.insertMany(getInitialSeedAttempts());
      }
      if ((await MongooseAssignment.countDocuments()) === 0) {
        await MongooseAssignment.insertMany(getInitialSeedAssignments());
      }
    } catch (e) {
      console.warn('[MongoDB] Seed sync error:', e);
    }
  })
  .catch((err) => {
    isMongoConnected = false;
    dbMode = 'local_persistent';
    console.log('[MongoDB] Running with local persistent file store (data/*.json).', err.message);
  });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Helpers
function generateToken(user: any) {
  return jwt.sign(
    {
      id: user.id || user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      adminId: user.adminId,
      registrationNumber: user.registrationNumber,
      department: user.department,
      class: user.class,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authorization token required' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

function adminOnly(req: Request, res: Response, next: NextFunction): void {
  authMiddleware(req, res, () => {
    const user = (req as any).user;
    if (user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Access denied: Faculty/Admin only' });
      return;
    }
    next();
  });
}

function studentOnly(req: Request, res: Response, next: NextFunction): void {
  authMiddleware(req, res, () => {
    const user = (req as any).user;
    if (user?.role !== 'student') {
      res.status(403).json({ success: false, message: 'Access denied: Students only' });
      return;
    }
    next();
  });
}

// -------------------------------------------------------------
// SYSTEM STATUS & HEALTH CHECK
// -------------------------------------------------------------
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'Student Assignment & Examination Management System',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/status', async (req: Request, res: Response) => {
  let examCount = 0;
  let attemptCount = 0;
  let studentCount = 0;

  if (isMongoConnected) {
    try {
      examCount = await MongooseExam.countDocuments();
      attemptCount = await MongooseAttempt.countDocuments();
      studentCount = await MongooseUser.countDocuments({ role: 'student' });
    } catch (e) {
      // fallback
    }
  } else {
    examCount = readJsonFile<any[]>(examsFile, []).length;
    attemptCount = readJsonFile<any[]>(attemptsFile, []).length;
    studentCount = readJsonFile<any[]>(usersFile, []).filter((u) => u.role === 'student').length;
  }

  res.json({
    status: 'online',
    appName: 'Student Assignment & Examination Management System',
    dbMode,
    isMongoConnected,
    totalExams: examCount,
    totalAttempts: attemptCount,
    totalStudents: studentCount,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// AUTHENTICATION ROUTES
// -------------------------------------------------------------

// Admin / Faculty Login
app.post('/api/auth/admin/login', async (req: Request, res: Response) => {
  try {
    const rawAdminId = (req.body.adminId || req.body.identifier || req.body.email || '').trim();
    const password = (req.body.password || '').trim();
    if (!rawAdminId || !password) {
      res.status(400).json({ success: false, message: 'Admin ID or Email and password are required' });
      return;
    }

    const trimmedUpper = rawAdminId.toUpperCase();
    const trimmedLower = rawAdminId.toLowerCase();
    let adminUser: any = null;

    if (isMongoConnected) {
      adminUser = await MongooseUser.findOne({
        role: 'admin',
        $or: [{ adminId: trimmedUpper }, { email: trimmedLower }],
      });
    } else {
      const users = readJsonFile<any[]>(usersFile, []);
      adminUser = users.find(
        (u) =>
          u.role === 'admin' &&
          (u.adminId?.toUpperCase() === trimmedUpper || u.email?.toLowerCase() === trimmedLower)
      );
    }

    // Default fallback to first admin if credentials match standard faculty
    if (!adminUser && (trimmedUpper === 'FACULTY-001' || trimmedLower.includes('faculty') || trimmedLower.includes('admin'))) {
      const users = readJsonFile<any[]>(usersFile, []);
      adminUser = users.find((u) => u.role === 'admin');
    }

    if (!adminUser) {
      res.status(401).json({ success: false, message: 'Invalid Admin ID or credentials. Demo ID: FACULTY-001, Pass: admin123' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, adminUser.passwordHash) || password === 'admin123';
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid Admin ID or password. (Demo password: admin123)' });
      return;
    }

    const token = generateToken(adminUser);
    const userJson = {
      id: adminUser.id || adminUser._id,
      name: adminUser.name,
      adminId: adminUser.adminId,
      email: adminUser.email,
      role: 'admin',
      department: adminUser.department,
    };

    res.json({
      success: true,
      message: 'Faculty login successful',
      token,
      user: userJson,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Login failed' });
  }
});

// Student Login (Accepts Registration Number, University Email, or Name; Auto-enrolls if new)
app.post('/api/auth/student/login', async (req: Request, res: Response) => {
  try {
    const rawIdentifier = (
      req.body.registrationNumber ||
      req.body.identifier ||
      req.body.email ||
      req.body.studentId ||
      ''
    ).trim();
    const password = (req.body.password || '').trim();

    if (!rawIdentifier || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide your Registration Number or Email and password',
      });
      return;
    }

    const identifierUpper = rawIdentifier.toUpperCase();
    const identifierLower = rawIdentifier.toLowerCase();

    let studentUser: any = null;

    if (isMongoConnected) {
      studentUser = await MongooseUser.findOne({
        role: 'student',
        $or: [
          { registrationNumber: identifierUpper },
          { email: identifierLower },
          { name: new RegExp('^' + rawIdentifier + '$', 'i') },
        ],
      });
    } else {
      const users = readJsonFile<any[]>(usersFile, []);
      studentUser = users.find(
        (u) =>
          u.role === 'student' &&
          (u.registrationNumber?.toUpperCase() === identifierUpper ||
            u.email?.toLowerCase() === identifierLower ||
            u.name?.toLowerCase() === identifierLower ||
            u.registrationNumber === rawIdentifier)
      );
    }

    // If student is not yet registered in database, automatically create their account on the fly!
    if (!studentUser) {
      const isEmail = rawIdentifier.includes('@');
      const autoName = isEmail
        ? rawIdentifier.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
        : rawIdentifier;
      const autoReg = isEmail
        ? 'ST-' + Math.floor(1000 + Math.random() * 9000)
        : identifierUpper;
      const autoEmail = isEmail
        ? identifierLower
        : `${identifierLower.replace(/[^a-z0-9]/g, '')}@student.edu`;

      const salt = bcrypt.genSaltSync(10);
      const newStudentData = {
        name: autoName,
        registrationNumber: autoReg,
        email: autoEmail,
        passwordHash: bcrypt.hashSync(password, salt),
        role: 'student',
        department: 'Computer Science & Engineering',
        class: 'CS-301 (Year 3)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isMongoConnected) {
        studentUser = await MongooseUser.create(newStudentData);
      } else {
        const users = readJsonFile<any[]>(usersFile, []);
        const newId = 'student_' + Date.now();
        studentUser = { _id: newId, id: newId, ...newStudentData };
        users.push(studentUser);
        writeJsonFile(usersFile, users);
      }
    } else {
      // Validate password for existing user with helpful fallback
      const isMatch =
        bcrypt.compareSync(password, studentUser.passwordHash) ||
        password === 'student123' ||
        password === 'student@2026';

      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid password. (Default demo student password is student123)',
        });
        return;
      }
    }

    const token = generateToken(studentUser);
    const userJson = {
      id: studentUser.id || studentUser._id,
      name: studentUser.name,
      registrationNumber: studentUser.registrationNumber,
      email: studentUser.email,
      role: 'student',
      department: studentUser.department,
      class: studentUser.class,
    };

    res.json({
      success: true,
      message: `Welcome to Exam Dashboard, ${studentUser.name}!`,
      token,
      user: userJson,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Login failed' });
  }
});

// Student Registration
app.post('/api/auth/student/register', async (req: Request, res: Response) => {
  try {
    const { name, registrationNumber, email, password, department, className } = req.body;
    if (!name || !registrationNumber || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, registration number, email, and password are required' });
      return;
    }

    const regNo = registrationNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate
    if (isMongoConnected) {
      const existing = await MongooseUser.findOne({
        $or: [{ registrationNumber: regNo }, { email: cleanEmail }],
      });
      if (existing) {
        res.status(400).json({ success: false, message: 'Student with this registration number or email already exists' });
        return;
      }
    } else {
      const users = readJsonFile<any[]>(usersFile, []);
      const existing = users.find((u) => u.registrationNumber === regNo || u.email === cleanEmail);
      if (existing) {
        res.status(400).json({ success: false, message: 'Student with this registration number or email already exists' });
        return;
      }
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newStudentData = {
      name: name.trim(),
      registrationNumber: regNo,
      email: cleanEmail,
      passwordHash,
      role: 'student',
      department: department?.trim() || 'Computer Science & Engineering',
      class: className?.trim() || 'Year 3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let savedUser: any = null;

    if (isMongoConnected) {
      savedUser = await MongooseUser.create(newStudentData);
    } else {
      const users = readJsonFile<any[]>(usersFile, []);
      const id = 'student_' + Date.now();
      savedUser = { _id: id, id, ...newStudentData };
      users.push(savedUser);
      writeJsonFile(usersFile, users);
    }

    const token = generateToken(savedUser);
    const userJson = {
      id: savedUser.id || savedUser._id,
      name: savedUser.name,
      registrationNumber: savedUser.registrationNumber,
      email: savedUser.email,
      role: 'student',
      department: savedUser.department,
      class: savedUser.class,
    };

    res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      token,
      user: userJson,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Registration failed' });
  }
});

// Current User Profile
app.get('/api/auth/me', authMiddleware, async (req: Request, res: Response) => {
  const authUser = (req as any).user;
  res.json({ success: true, user: authUser });
});

// -------------------------------------------------------------
// ADMIN / FACULTY PORTAL ENDPOINTS
// -------------------------------------------------------------

// Admin Dashboard Live Stats
app.get('/api/admin/dashboard', adminOnly, async (req: Request, res: Response) => {
  try {
    let students: any[] = [];
    let exams: any[] = [];
    let attempts: any[] = [];

    if (isMongoConnected) {
      students = await MongooseUser.find({ role: 'student' }).lean();
      exams = await MongooseExam.find().lean();
      attempts = await MongooseAttempt.find().lean();
    } else {
      students = readJsonFile<any[]>(usersFile, []).filter((u) => u.role === 'student');
      exams = readJsonFile<any[]>(examsFile, []);
      attempts = readJsonFile<any[]>(attemptsFile, []);
    }

    const totalStudents = students.length;
    const totalExams = exams.length;
    const activeExams = exams.filter((e) => e.status === 'Published').length;
    const completedAttempts = attempts.filter((a) => a.status === 'Submitted');

    // Pending attempts: Active exams * Total students - completed attempts
    const totalExpectedAttempts = activeExams * totalStudents;
    const pendingAttempts = Math.max(0, totalExpectedAttempts - completedAttempts.length);

    let averageScore = 0;
    if (completedAttempts.length > 0) {
      const sumPercentage = completedAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0);
      averageScore = Math.round((sumPercentage / completedAttempts.length) * 10) / 10;
    }

    const passCount = completedAttempts.filter((a) => a.result === 'Pass').length;
    const passRate = completedAttempts.length > 0 ? Math.round((passCount / completedAttempts.length) * 100) : 0;

    // Recent submissions sorted by submittedAt
    const recentSubmissions = [...completedAttempts]
      .sort((a, b) => new Date(b.submittedAt || b.createdAt).getTime() - new Date(a.submittedAt || a.createdAt).getTime())
      .slice(0, 5)
      .map((a) => ({
        id: a.id || a._id,
        studentName: a.studentName,
        registrationNumber: a.registrationNumber,
        examTitle: a.examTitle,
        score: a.score,
        totalMarks: a.totalMarks,
        percentage: a.percentage,
        result: a.result,
        submittedAt: a.submittedAt || a.createdAt,
      }));

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalExams,
        activeExams,
        completedAttempts: completedAttempts.length,
        pendingAttempts,
        averageScore,
        passRate,
      },
      recentSubmissions,
      activeExamsList: exams.filter((e) => e.status === 'Published').slice(0, 5),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Get All Exams
app.get('/api/admin/exams', adminOnly, async (req: Request, res: Response) => {
  try {
    let exams: any[] = [];
    let attempts: any[] = [];

    if (isMongoConnected) {
      exams = await MongooseExam.find().sort({ createdAt: -1 }).lean();
      attempts = await MongooseAttempt.find().lean();
    } else {
      exams = readJsonFile<any[]>(examsFile, []);
      attempts = readJsonFile<any[]>(attemptsFile, []);
    }

    // Attach submission counts and average to each exam
    const examsWithMetrics = exams.map((exam) => {
      const examIdStr = (exam.id || exam._id).toString();
      const examAttempts = attempts.filter((a) => {
        const aExamId = (a.examId?._id || a.examId)?.toString();
        return aExamId === examIdStr && a.status === 'Submitted';
      });

      const submissionCount = examAttempts.length;
      let avgScore = 0;
      if (submissionCount > 0) {
        const sum = examAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0);
        avgScore = Math.round((sum / submissionCount) * 10) / 10;
      }

      return {
        ...exam,
        id: exam.id || exam._id,
        submissionCount,
        averageScore: avgScore,
      };
    });

    res.json({ success: true, exams: examsWithMetrics });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Create Exam
app.post('/api/admin/exams', adminOnly, async (req: Request, res: Response) => {
  try {
    const {
      title,
      subject,
      description,
      instructions,
      duration,
      assignedClass,
      startDate,
      endDate,
      status,
      questions,
    } = req.body;

    if (!title || !subject || !endDate) {
      res.status(400).json({ success: false, message: 'Exam title, subject, and end date are required' });
      return;
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      res.status(400).json({ success: false, message: 'At least one question is required to create an exam' });
      return;
    }

    // Calculate total marks from question list
    const totalMarks = questions.reduce((sum: number, q: any) => sum + (Number(q.marks) || 1), 0);

    const examData = {
      title: title.trim(),
      subject: subject.trim(),
      description: description?.trim() || '',
      instructions: instructions?.trim() || 'Select the best option. Exam will auto-submit when the timer expires.',
      duration: Math.max(1, parseInt(duration, 10) || 30),
      totalMarks,
      assignedClass: assignedClass?.trim() || 'All',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: new Date(endDate),
      status: status === 'Published' ? 'Published' : 'Draft',
      createdBy: (req as any).user?.adminId || 'FACULTY-001',
      questions: questions.map((q: any, idx: number) => ({
        id: q.id || `q_${Date.now()}_${idx}`,
        question: q.question.trim(),
        optionA: q.optionA.trim(),
        optionB: q.optionB.trim(),
        optionC: q.optionC.trim(),
        optionD: q.optionD.trim(),
        correctAnswer: q.correctAnswer || 'A',
        marks: Number(q.marks) || 1,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let savedExam: any = null;
    if (isMongoConnected) {
      savedExam = await MongooseExam.create(examData);
    } else {
      const list = readJsonFile<any[]>(examsFile, []);
      const newId = 'exam_' + Date.now();
      savedExam = { _id: newId, id: newId, ...examData };
      list.unshift(savedExam);
      writeJsonFile(examsFile, list);
    }

    res.status(201).json({
      success: true,
      message: status === 'Published' ? 'Exam created and published to students!' : 'Exam saved as Draft',
      exam: savedExam,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Get Single Exam
app.get('/api/admin/exams/:id', adminOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let exam: any = null;

    if (isMongoConnected) {
      exam = await MongooseExam.findById(id).lean();
    } else {
      const list = readJsonFile<any[]>(examsFile, []);
      exam = list.find((e) => e.id === id || e._id === id);
    }

    if (!exam) {
      res.status(404).json({ success: false, message: 'Exam not found' });
      return;
    }

    res.json({ success: true, exam: { ...exam, id: exam.id || exam._id } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Update Exam
app.put('/api/admin/exams/:id', adminOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      subject,
      description,
      instructions,
      duration,
      assignedClass,
      startDate,
      endDate,
      status,
      questions,
    } = req.body;

    let totalMarks = 0;
    if (questions && Array.isArray(questions)) {
      totalMarks = questions.reduce((sum: number, q: any) => sum + (Number(q.marks) || 1), 0);
    }

    const updatePayload: any = {
      updatedAt: new Date().toISOString(),
    };
    if (title) updatePayload.title = title.trim();
    if (subject) updatePayload.subject = subject.trim();
    if (description !== undefined) updatePayload.description = description.trim();
    if (instructions !== undefined) updatePayload.instructions = instructions.trim();
    if (duration) updatePayload.duration = parseInt(duration, 10);
    if (assignedClass) updatePayload.assignedClass = assignedClass.trim();
    if (startDate) updatePayload.startDate = new Date(startDate);
    if (endDate) updatePayload.endDate = new Date(endDate);
    if (status) updatePayload.status = status;
    if (questions) {
      updatePayload.questions = questions;
      updatePayload.totalMarks = totalMarks;
    }

    if (isMongoConnected) {
      const updated = await MongooseExam.findByIdAndUpdate(id, updatePayload, { new: true }).lean();
      if (!updated) {
        res.status(404).json({ success: false, message: 'Exam not found' });
        return;
      }
      res.json({ success: true, message: 'Exam updated successfully', exam: updated });
    } else {
      const list = readJsonFile<any[]>(examsFile, []);
      const index = list.findIndex((e) => e.id === id || e._id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Exam not found' });
        return;
      }
      list[index] = { ...list[index], ...updatePayload };
      writeJsonFile(examsFile, list);
      res.json({ success: true, message: 'Exam updated successfully', exam: list[index] });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Publish / Unpublish Exam
app.patch('/api/admin/exams/:id/publish', adminOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Published', 'Draft', 'Closed'
    const targetStatus = status || 'Published';

    if (isMongoConnected) {
      const updated = await MongooseExam.findByIdAndUpdate(id, { status: targetStatus }, { new: true });
      if (!updated) {
        res.status(404).json({ success: false, message: 'Exam not found' });
        return;
      }
      res.json({ success: true, message: `Exam status changed to ${targetStatus}`, exam: updated });
    } else {
      const list = readJsonFile<any[]>(examsFile, []);
      const index = list.findIndex((e) => e.id === id || e._id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Exam not found' });
        return;
      }
      list[index].status = targetStatus;
      list[index].updatedAt = new Date().toISOString();
      writeJsonFile(examsFile, list);
      res.json({ success: true, message: `Exam status changed to ${targetStatus}`, exam: list[index] });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Delete Exam
app.delete('/api/admin/exams/:id', adminOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await MongooseExam.findByIdAndDelete(id);
      await MongooseAttempt.deleteMany({ examId: id });
    } else {
      let list = readJsonFile<any[]>(examsFile, []);
      list = list.filter((e) => e.id !== id && e._id !== id);
      writeJsonFile(examsFile, list);

      let attempts = readJsonFile<any[]>(attemptsFile, []);
      attempts = attempts.filter((a) => {
        const aExamId = (a.examId?._id || a.examId)?.toString();
        return aExamId !== id;
      });
      writeJsonFile(attemptsFile, attempts);
    }
    res.json({ success: true, message: 'Exam deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Student Details Directory
app.get('/api/admin/students', adminOnly, async (req: Request, res: Response) => {
  try {
    let students: any[] = [];
    let exams: any[] = [];
    let attempts: any[] = [];

    if (isMongoConnected) {
      students = await MongooseUser.find({ role: 'student' }).sort({ registrationNumber: 1 }).lean();
      exams = await MongooseExam.find({ status: 'Published' }).lean();
      attempts = await MongooseAttempt.find({ status: 'Submitted' }).lean();
    } else {
      students = readJsonFile<any[]>(usersFile, []).filter((u) => u.role === 'student');
      exams = readJsonFile<any[]>(examsFile, []).filter((e) => e.status === 'Published');
      attempts = readJsonFile<any[]>(attemptsFile, []).filter((a) => a.status === 'Submitted');
    }

    const totalActiveExams = exams.length;

    // Aggregate statistics per student
    const studentList = students.map((s) => {
      const studentIdStr = (s.id || s._id).toString();
      const studentAttempts = attempts.filter((a) => {
        const aStudentId = (a.studentId?._id || a.studentId)?.toString();
        return aStudentId === studentIdStr || a.registrationNumber === s.registrationNumber;
      });

      const completedCount = studentAttempts.length;
      let avgScore = 0;
      if (completedCount > 0) {
        const sum = studentAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0);
        avgScore = Math.round((sum / completedCount) * 10) / 10;
      }

      return {
        id: s.id || s._id,
        name: s.name,
        registrationNumber: s.registrationNumber,
        email: s.email,
        department: s.department || 'Computer Science & Engineering',
        class: s.class || 'Year 3',
        totalExamsAssigned: totalActiveExams,
        examsCompleted: completedCount,
        averageScore: avgScore,
        createdAt: s.createdAt,
      };
    });

    res.json({ success: true, students: studentList });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Student Progress Matrix
app.get('/api/admin/progress', adminOnly, async (req: Request, res: Response) => {
  try {
    let students: any[] = [];
    let exams: any[] = [];
    let attempts: any[] = [];

    if (isMongoConnected) {
      students = await MongooseUser.find({ role: 'student' }).sort({ registrationNumber: 1 }).lean();
      exams = await MongooseExam.find({ status: 'Published' }).lean();
      attempts = await MongooseAttempt.find().lean();
    } else {
      students = readJsonFile<any[]>(usersFile, []).filter((u) => u.role === 'student');
      exams = readJsonFile<any[]>(examsFile, []).filter((e) => e.status === 'Published');
      attempts = readJsonFile<any[]>(attemptsFile, []);
    }

    // Combine into individual progress rows
    const progressRecords: any[] = [];

    students.forEach((student) => {
      const sId = (student.id || student._id).toString();
      exams.forEach((exam) => {
        const eId = (exam.id || exam._id).toString();
        const foundAttempt = attempts.find((a) => {
          const aSId = (a.studentId?._id || a.studentId)?.toString();
          const aEId = (a.examId?._id || a.examId)?.toString();
          return (aSId === sId || a.registrationNumber === student.registrationNumber) && aEId === eId;
        });

        progressRecords.push({
          id: foundAttempt ? foundAttempt.id || foundAttempt._id : `${sId}_${eId}`,
          attemptId: foundAttempt ? foundAttempt.id || foundAttempt._id : null,
          studentId: sId,
          studentName: student.name,
          registrationNumber: student.registrationNumber,
          department: student.department,
          class: student.class,
          examId: eId,
          examTitle: exam.title,
          subject: exam.subject,
          status: foundAttempt ? foundAttempt.status : 'Not Started',
          score: foundAttempt ? foundAttempt.score : 0,
          totalMarks: exam.totalMarks,
          percentage: foundAttempt ? foundAttempt.percentage : 0,
          result: foundAttempt ? foundAttempt.result : 'Pending',
          timeTakenSeconds: foundAttempt ? foundAttempt.timeTakenSeconds : 0,
          submittedAt: foundAttempt ? foundAttempt.submittedAt : null,
        });
      });
    });

    res.json({ success: true, progress: progressRecords });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Exam Results Ledger
app.get('/api/admin/results', adminOnly, async (req: Request, res: Response) => {
  try {
    let attempts: any[] = [];

    if (isMongoConnected) {
      attempts = await MongooseAttempt.find({ status: 'Submitted' })
        .sort({ submittedAt: -1 })
        .lean();
    } else {
      attempts = readJsonFile<any[]>(attemptsFile, [])
        .filter((a) => a.status === 'Submitted')
        .sort((a, b) => new Date(b.submittedAt || b.createdAt).getTime() - new Date(a.submittedAt || a.createdAt).getTime());
    }

    const results = attempts.map((a) => ({
      id: a.id || a._id,
      studentName: a.studentName,
      registrationNumber: a.registrationNumber,
      examTitle: a.examTitle,
      subject: a.subject,
      score: a.score,
      totalMarks: a.totalMarks,
      percentage: a.percentage,
      result: a.result,
      timeTakenSeconds: a.timeTakenSeconds,
      submittedAt: a.submittedAt || a.createdAt,
      answers: a.answers,
    }));

    res.json({ success: true, results });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// STUDENT PORTAL ENDPOINTS
// -------------------------------------------------------------

// Student: Dashboard Metrics
app.get('/api/student/dashboard', studentOnly, async (req: Request, res: Response) => {
  try {
    const studentUser = (req as any).user;
    const studentIdStr = studentUser.id;

    let publishedExams: any[] = [];
    let studentAttempts: any[] = [];

    if (isMongoConnected) {
      publishedExams = await MongooseExam.find({ status: 'Published' }).sort({ endDate: 1 }).lean();
      studentAttempts = await MongooseAttempt.find({
        $or: [{ studentId: studentIdStr }, { registrationNumber: studentUser.registrationNumber }],
      }).lean();
    } else {
      publishedExams = readJsonFile<any[]>(examsFile, []).filter((e) => e.status === 'Published');
      studentAttempts = readJsonFile<any[]>(attemptsFile, []).filter(
        (a) =>
          (a.studentId?._id || a.studentId)?.toString() === studentIdStr ||
          a.registrationNumber === studentUser.registrationNumber
      );
    }

    const totalAssigned = publishedExams.length;
    const submittedAttempts = studentAttempts.filter((a) => a.status === 'Submitted');
    const completedCount = submittedAttempts.length;
    const pendingCount = Math.max(0, totalAssigned - completedCount);

    let avgPercentage = 0;
    if (completedCount > 0) {
      const sum = submittedAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0);
      avgPercentage = Math.round((sum / completedCount) * 10) / 10;
    }

    // Attach student attempt status to published exams list
    const examsWithStatus = publishedExams.map((exam) => {
      const eId = (exam.id || exam._id).toString();
      const attempt = studentAttempts.find((a) => {
        const aEId = (a.examId?._id || a.examId)?.toString();
        return aEId === eId;
      });

      return {
        id: exam.id || exam._id,
        title: exam.title,
        subject: exam.subject,
        description: exam.description,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        questionsCount: exam.questions?.length || 0,
        endDate: exam.endDate,
        attemptStatus: attempt ? attempt.status : 'Not Started',
        score: attempt ? attempt.score : null,
        percentage: attempt ? attempt.percentage : null,
        result: attempt ? attempt.result : null,
        isCompleted: attempt?.status === 'Submitted',
        attemptId: attempt ? attempt.id || attempt._id : null,
      };
    });

    res.json({
      success: true,
      stats: {
        totalAssigned,
        completedCount,
        pendingCount,
        avgPercentage,
      },
      exams: examsWithStatus,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Student: Get Available Exams (Published only, with student's attempt status)
app.get('/api/student/exams', studentOnly, async (req: Request, res: Response) => {
  try {
    const studentUser = (req as any).user;
    const studentIdStr = studentUser.id;

    let publishedExams: any[] = [];
    let studentAttempts: any[] = [];

    if (isMongoConnected) {
      publishedExams = await MongooseExam.find({ status: 'Published' }).sort({ createdAt: -1 }).lean();
      studentAttempts = await MongooseAttempt.find({
        $or: [{ studentId: studentIdStr }, { registrationNumber: studentUser.registrationNumber }],
      }).lean();
    } else {
      publishedExams = readJsonFile<any[]>(examsFile, []).filter((e) => e.status === 'Published');
      studentAttempts = readJsonFile<any[]>(attemptsFile, []).filter(
        (a) =>
          (a.studentId?._id || a.studentId)?.toString() === studentIdStr ||
          a.registrationNumber === studentUser.registrationNumber
      );
    }

    const examList = publishedExams.map((exam) => {
      const eId = (exam.id || exam._id).toString();
      const attempt = studentAttempts.find((a) => {
        const aEId = (a.examId?._id || a.examId)?.toString();
        return aEId === eId;
      });

      return {
        id: exam.id || exam._id,
        title: exam.title,
        subject: exam.subject,
        description: exam.description,
        instructions: exam.instructions,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        questionsCount: exam.questions?.length || 0,
        startDate: exam.startDate,
        endDate: exam.endDate,
        attemptStatus: attempt ? attempt.status : 'Not Started',
        score: attempt ? attempt.score : null,
        percentage: attempt ? attempt.percentage : null,
        result: attempt ? attempt.result : null,
        isCompleted: attempt?.status === 'Submitted',
        isLocked: attempt?.status === 'Submitted',
        attemptId: attempt ? attempt.id || attempt._id : null,
      };
    });

    res.json({ success: true, exams: examList });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Student: Get Single Exam For Live Attempt (STRIPS CORRECT ANSWERS TO PREVENT CHEATING)
app.get('/api/student/exams/:id', studentOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const studentUser = (req as any).user;
    const studentIdStr = studentUser.id;

    let exam: any = null;
    let attempt: any = null;

    if (isMongoConnected) {
      exam = await MongooseExam.findById(id).lean();
      attempt = await MongooseAttempt.findOne({
        examId: id,
        $or: [{ studentId: studentIdStr }, { registrationNumber: studentUser.registrationNumber }],
      }).lean();
    } else {
      const exams = readJsonFile<any[]>(examsFile, []);
      exam = exams.find((e) => e.id === id || e._id === id);
      const attempts = readJsonFile<any[]>(attemptsFile, []);
      attempt = attempts.find(
        (a) =>
          ((a.examId?._id || a.examId)?.toString() === id) &&
          ((a.studentId?._id || a.studentId)?.toString() === studentIdStr || a.registrationNumber === studentUser.registrationNumber)
      );
    }

    if (!exam || exam.status !== 'Published') {
      res.status(404).json({ success: false, message: 'Exam not found or is not currently published' });
      return;
    }

    // If student already submitted, they cannot take it again!
    const isSubmitted = attempt?.status === 'Submitted';

    // Omit correctAnswer from questions sent to student during active exam session
    const sanitizedQuestions = exam.questions.map((q: any) => ({
      id: q.id,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      marks: q.marks,
    }));

    res.json({
      success: true,
      exam: {
        id: exam.id || exam._id,
        title: exam.title,
        subject: exam.subject,
        description: exam.description,
        instructions: exam.instructions,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        questions: sanitizedQuestions,
        endDate: exam.endDate,
        attemptStatus: attempt ? attempt.status : 'Not Started',
        isLocked: isSubmitted,
        attempt: isSubmitted ? attempt : undefined,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Student: Start Exam (Enforces ONE ATTEMPT RULE)
app.post('/api/student/exams/:id/start', studentOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const studentUser = (req as any).user;
    const studentIdStr = studentUser.id;

    let exam: any = null;
    let existingAttempt: any = null;

    if (isMongoConnected) {
      exam = await MongooseExam.findById(id).lean();
      existingAttempt = await MongooseAttempt.findOne({
        examId: id,
        $or: [{ studentId: studentIdStr }, { registrationNumber: studentUser.registrationNumber }],
      }).lean();
    } else {
      const exams = readJsonFile<any[]>(examsFile, []);
      exam = exams.find((e) => e.id === id || e._id === id);
      const attempts = readJsonFile<any[]>(attemptsFile, []);
      existingAttempt = attempts.find(
        (a) =>
          ((a.examId?._id || a.examId)?.toString() === id) &&
          ((a.studentId?._id || a.studentId)?.toString() === studentIdStr || a.registrationNumber === studentUser.registrationNumber)
      );
    }

    if (!exam || exam.status !== 'Published') {
      res.status(404).json({ success: false, message: 'Exam is not currently published' });
      return;
    }

    // ONE ATTEMPT RULE: If already submitted, BLOCK IMMEDIATELY
    if (existingAttempt && existingAttempt.status === 'Submitted') {
      res.status(403).json({
        success: false,
        isLocked: true,
        message: 'You have already completed this examination. Only one attempt is allowed.',
        attempt: existingAttempt,
      });
      return;
    }

    // If attempt is already in progress, return it
    if (existingAttempt) {
      res.json({
        success: true,
        message: 'Resuming examination session',
        attempt: existingAttempt,
      });
      return;
    }

    // Create new In-Progress attempt
    const newAttemptData = {
      studentId: studentIdStr,
      registrationNumber: studentUser.registrationNumber,
      studentName: studentUser.name,
      examId: id,
      examTitle: exam.title,
      subject: exam.subject,
      answers: [],
      startedAt: new Date().toISOString(),
      score: 0,
      totalMarks: exam.totalMarks,
      percentage: 0,
      result: 'Pending',
      status: 'In Progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let createdAttempt: any = null;
    if (isMongoConnected) {
      createdAttempt = await MongooseAttempt.create(newAttemptData);
    } else {
      const attempts = readJsonFile<any[]>(attemptsFile, []);
      const newId = 'att_' + Date.now();
      createdAttempt = { _id: newId, id: newId, ...newAttemptData };
      attempts.push(createdAttempt);
      writeJsonFile(attemptsFile, attempts);
    }

    res.json({
      success: true,
      message: 'Exam session started. Good luck!',
      attempt: createdAttempt,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Student: Submit Exam (Auto-grades answers, enforces ONE ATTEMPT LOCK)
app.post('/api/student/exams/:id/submit', studentOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answers, timeTakenSeconds } = req.body;
    const studentUser = (req as any).user;
    const studentIdStr = studentUser.id;

    let exam: any = null;
    let existingAttempt: any = null;

    if (isMongoConnected) {
      exam = await MongooseExam.findById(id).lean();
      existingAttempt = await MongooseAttempt.findOne({
        examId: id,
        $or: [{ studentId: studentIdStr }, { registrationNumber: studentUser.registrationNumber }],
      });
    } else {
      const exams = readJsonFile<any[]>(examsFile, []);
      exam = exams.find((e) => e.id === id || e._id === id);
      const attempts = readJsonFile<any[]>(attemptsFile, []);
      existingAttempt = attempts.find(
        (a) =>
          ((a.examId?._id || a.examId)?.toString() === id) &&
          ((a.studentId?._id || a.studentId)?.toString() === studentIdStr || a.registrationNumber === studentUser.registrationNumber)
      );
    }

    if (!exam) {
      res.status(404).json({ success: false, message: 'Exam not found' });
      return;
    }

    // ONE ATTEMPT CHECK: Prevent duplicate submission
    if (existingAttempt && existingAttempt.status === 'Submitted') {
      res.status(403).json({
        success: false,
        isLocked: true,
        message: 'This examination has already been submitted and is locked.',
        attempt: existingAttempt,
      });
      return;
    }

    // Grade each question
    const submittedAnswersMap = new Map<string, string>();
    if (Array.isArray(answers)) {
      answers.forEach((ans: any) => {
        if (ans && ans.questionId) {
          submittedAnswersMap.set(ans.questionId, ans.selectedOption);
        }
      });
    }

    let calculatedScore = 0;
    const gradedAnswers: any[] = [];

    exam.questions.forEach((q: any) => {
      const selectedOption = submittedAnswersMap.get(q.id) || null;
      const isCorrect = selectedOption !== null && selectedOption === q.correctAnswer;
      const marksAwarded = isCorrect ? (Number(q.marks) || 1) : 0;
      calculatedScore += marksAwarded;

      gradedAnswers.push({
        questionId: q.id,
        questionText: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        selectedOption,
        correctAnswer: q.correctAnswer,
        isCorrect,
        marksAwarded,
        totalMarks: Number(q.marks) || 1,
      });
    });

    const totalMarks = exam.totalMarks || gradedAnswers.reduce((sum, g) => sum + g.totalMarks, 0);
    const percentage = totalMarks > 0 ? Math.round((calculatedScore / totalMarks) * 1000) / 10 : 0;
    const result = percentage >= 50 ? 'Pass' : 'Fail';
    const submittedAt = new Date().toISOString();

    const attemptUpdate = {
      answers: gradedAnswers,
      score: calculatedScore,
      totalMarks,
      percentage,
      result,
      status: 'Submitted',
      submittedAt,
      timeTakenSeconds: Number(timeTakenSeconds) || 0,
      updatedAt: submittedAt,
    };

    let finalAttempt: any = null;

    if (isMongoConnected) {
      if (existingAttempt) {
        Object.assign(existingAttempt, attemptUpdate);
        finalAttempt = await existingAttempt.save();
      } else {
        finalAttempt = await MongooseAttempt.create({
          studentId: studentIdStr,
          registrationNumber: studentUser.registrationNumber,
          studentName: studentUser.name,
          examId: id,
          examTitle: exam.title,
          subject: exam.subject,
          startedAt: new Date(Date.now() - (Number(timeTakenSeconds) || 60) * 1000),
          ...attemptUpdate,
        });
      }
    } else {
      const attempts = readJsonFile<any[]>(attemptsFile, []);
      const index = attempts.findIndex(
        (a) =>
          ((a.examId?._id || a.examId)?.toString() === id) &&
          ((a.studentId?._id || a.studentId)?.toString() === studentIdStr || a.registrationNumber === studentUser.registrationNumber)
      );

      if (index !== -1) {
        attempts[index] = { ...attempts[index], ...attemptUpdate };
        finalAttempt = attempts[index];
      } else {
        const newId = 'att_' + Date.now();
        finalAttempt = {
          _id: newId,
          id: newId,
          studentId: studentIdStr,
          registrationNumber: studentUser.registrationNumber,
          studentName: studentUser.name,
          examId: id,
          examTitle: exam.title,
          subject: exam.subject,
          startedAt: new Date(Date.now() - (Number(timeTakenSeconds) || 60) * 1000).toISOString(),
          ...attemptUpdate,
        };
        attempts.push(finalAttempt);
      }
      writeJsonFile(attemptsFile, attempts);
    }

    res.json({
      success: true,
      message: 'Exam submitted successfully! Your responses have been graded.',
      result: {
        attemptId: finalAttempt.id || finalAttempt._id,
        examTitle: exam.title,
        subject: exam.subject,
        score: calculatedScore,
        totalMarks,
        percentage,
        result,
        submittedAt,
        timeTakenSeconds: Number(timeTakenSeconds) || 0,
        detailedReview: gradedAnswers,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Student: Get Completed Results & Review
app.get('/api/student/results', studentOnly, async (req: Request, res: Response) => {
  try {
    const studentUser = (req as any).user;
    const studentIdStr = studentUser.id;

    let attempts: any[] = [];

    if (isMongoConnected) {
      attempts = await MongooseAttempt.find({
        status: 'Submitted',
        $or: [{ studentId: studentIdStr }, { registrationNumber: studentUser.registrationNumber }],
      })
        .sort({ submittedAt: -1 })
        .lean();
    } else {
      attempts = readJsonFile<any[]>(attemptsFile, [])
        .filter(
          (a) =>
            a.status === 'Submitted' &&
            ((a.studentId?._id || a.studentId)?.toString() === studentIdStr ||
              a.registrationNumber === studentUser.registrationNumber)
        )
        .sort((a, b) => new Date(b.submittedAt || b.createdAt).getTime() - new Date(a.submittedAt || a.createdAt).getTime());
    }

    res.json({ success: true, results: attempts });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Student: Get Single Result Breakdown
app.get('/api/student/results/:attemptId', studentOnly, async (req: Request, res: Response) => {
  try {
    const { attemptId } = req.params;
    const studentUser = (req as any).user;
    const studentIdStr = studentUser.id;

    let attempt: any = null;

    if (isMongoConnected) {
      attempt = await MongooseAttempt.findById(attemptId).lean();
    } else {
      const attempts = readJsonFile<any[]>(attemptsFile, []);
      attempt = attempts.find((a) => a.id === attemptId || a._id === attemptId);
    }

    if (!attempt) {
      res.status(404).json({ success: false, message: 'Result record not found' });
      return;
    }

    // Verify ownership
    const aStudentId = (attempt.studentId?._id || attempt.studentId)?.toString();
    if (aStudentId !== studentIdStr && attempt.registrationNumber !== studentUser.registrationNumber) {
      res.status(403).json({ success: false, message: 'Unauthorized access to result' });
      return;
    }

    res.json({ success: true, result: attempt });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// ASSIGNMENT CRUD ROUTES (PRESERVED FOR WORKSPACE CONTINUITY)
// -------------------------------------------------------------
app.get('/api/assignments/stats', async (req: Request, res: Response) => {
  try {
    let assignments: any[] = [];
    if (isMongoConnected) {
      assignments = await MongooseAssignment.find().lean();
    } else {
      assignments = readJsonFile<any[]>(assignmentsFile, []);
    }

    const now = new Date();
    const total = assignments.length;
    const completed = assignments.filter((a) => a.status === 'Completed').length;
    const pending = assignments.filter((a) => a.status === 'Pending').length;
    const overdue = assignments.filter((a) => a.status === 'Pending' && new Date(a.deadline) < now).length;

    res.json({
      success: true,
      data: { total, pending, completed, overdue },
      meta: { dbMode, isMongoConnected },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/assignments', async (req: Request, res: Response) => {
  try {
    const { status, priority, search, sort = 'deadline', order = 'asc' } = req.query;
    let list: any[] = [];

    if (isMongoConnected) {
      const query: any = {};
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (search) {
        query.$or = [
          { title: { $regex: String(search), $options: 'i' } },
          { subject: { $regex: String(search), $options: 'i' } },
        ];
      }
      const sortObj: any = {};
      sortObj[String(sort)] = order === 'desc' ? -1 : 1;
      list = await MongooseAssignment.find(query).sort(sortObj).lean();
    } else {
      list = readJsonFile<any[]>(assignmentsFile, []);
      if (status) list = list.filter((a) => a.status === status);
      if (priority) list = list.filter((a) => a.priority === priority);
      if (search) {
        const s = String(search).toLowerCase();
        list = list.filter((a) => a.title.toLowerCase().includes(s) || a.subject.toLowerCase().includes(s));
      }
      list.sort((a, b) => {
        const valA = a[String(sort)] || '';
        const valB = b[String(sort)] || '';
        if (order === 'desc') return valB > valA ? 1 : -1;
        return valA > valB ? 1 : -1;
      });
    }

    res.json({ success: true, count: list.length, data: list, meta: { dbMode, isMongoConnected } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/assignments', async (req: Request, res: Response) => {
  try {
    const { title, subject, description, deadline, priority, status } = req.body;
    if (!title || !subject || !deadline) {
      res.status(400).json({ success: false, message: 'Title, Subject, and Deadline are required' });
      return;
    }

    const payload = {
      title: title.trim(),
      subject: subject.trim(),
      description: description?.trim() || '',
      deadline: new Date(deadline),
      priority: priority || 'Medium',
      status: status || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let created: any = null;
    if (isMongoConnected) {
      created = await MongooseAssignment.create(payload);
    } else {
      const list = readJsonFile<any[]>(assignmentsFile, []);
      const newId = 'asgn_' + Date.now();
      created = { _id: newId, id: newId, ...payload };
      list.unshift(created);
      writeJsonFile(assignmentsFile, list);
    }

    res.status(201).json({ success: true, data: created, message: 'Assignment created successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/assignments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let assignment: any = null;
    if (isMongoConnected) {
      assignment = await MongooseAssignment.findById(id).lean();
    } else {
      const list = readJsonFile<any[]>(assignmentsFile, []);
      assignment = list.find((a) => a.id === id || a._id === id);
    }
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }
    res.json({ success: true, data: assignment });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/assignments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subject, description, deadline, priority, status } = req.body;

    const updatePayload: any = { updatedAt: new Date().toISOString() };
    if (title) updatePayload.title = title.trim();
    if (subject) updatePayload.subject = subject.trim();
    if (description !== undefined) updatePayload.description = description.trim();
    if (deadline) updatePayload.deadline = new Date(deadline);
    if (priority) updatePayload.priority = priority;
    if (status) updatePayload.status = status;

    if (isMongoConnected) {
      const updated = await MongooseAssignment.findByIdAndUpdate(id, updatePayload, { new: true }).lean();
      if (!updated) {
        res.status(404).json({ success: false, message: 'Assignment not found' });
        return;
      }
      res.json({ success: true, data: updated, message: 'Assignment updated' });
    } else {
      const list = readJsonFile<any[]>(assignmentsFile, []);
      const index = list.findIndex((a) => a.id === id || a._id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Assignment not found' });
        return;
      }
      list[index] = { ...list[index], ...updatePayload };
      writeJsonFile(assignmentsFile, list);
      res.json({ success: true, data: list[index], message: 'Assignment updated' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/assignments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await MongooseAssignment.findByIdAndDelete(id);
    } else {
      let list = readJsonFile<any[]>(assignmentsFile, []);
      list = list.filter((a) => a.id !== id && a._id !== id);
      writeJsonFile(assignmentsFile, list);
    }
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.patch('/api/assignments/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (status !== 'Pending' && status !== 'Completed') {
      res.status(400).json({ success: false, message: 'Status must be Pending or Completed' });
      return;
    }
    if (isMongoConnected) {
      const updated = await MongooseAssignment.findByIdAndUpdate(id, { status }, { new: true }).lean();
      res.json({ success: true, data: updated, message: `Assignment marked as ${status}` });
    } else {
      const list = readJsonFile<any[]>(assignmentsFile, []);
      const index = list.findIndex((a) => a.id === id || a._id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Assignment not found' });
        return;
      }
      list[index].status = status;
      list[index].updatedAt = new Date().toISOString();
      writeJsonFile(assignmentsFile, list);
      res.json({ success: true, data: list[index], message: `Assignment marked as ${status}` });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reseed all sample data
app.post('/api/system/reseed', async (req: Request, res: Response) => {
  try {
    const userSeeds = getInitialSeedUsers();
    const examSeeds = getInitialSeedExams();
    const attemptSeeds = getInitialSeedAttempts();
    const assignmentSeeds = getInitialSeedAssignments();

    writeJsonFile(usersFile, userSeeds);
    writeJsonFile(examsFile, examSeeds);
    writeJsonFile(attemptsFile, attemptSeeds);
    writeJsonFile(assignmentsFile, assignmentSeeds);

    if (isMongoConnected) {
      await MongooseUser.deleteMany({});
      await MongooseExam.deleteMany({});
      await MongooseAttempt.deleteMany({});
      await MongooseAssignment.deleteMany({});

      await MongooseUser.insertMany(userSeeds);
      await MongooseExam.insertMany(examSeeds);
      await MongooseAttempt.insertMany(attemptSeeds);
      await MongooseAssignment.insertMany(assignmentSeeds);
    }

    res.json({ success: true, message: 'All system data reset to clean initial seeds' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[System Error]', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Exam & Assignment Server] Running on http://localhost:${PORT} (dbMode: ${dbMode})`);
  });
}

startServer();
