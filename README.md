# Student Assignment & Examination Management System

A unified, production-grade full-stack academic platform featuring two integrated portals powered by a single Express REST API and MongoDB:

1. **Admin / Faculty Portal**: Exam creation with multiple-choice question sets, live attendance and progress tracking, automated grading, student directory, and gradebook ledger.
2. **Student Portal**: Available timed examinations with live countdown timer, single-attempt lock enforcement, server-side grading, and detailed question-by-question review.
3. **Coursework & Assignment Workspace**: Comprehensive task and homework productivity dashboard.

---

## 1. Quick Start & Demo Credentials

### Faculty / Admin Portal:
- **URL**: `/admin/login`
- **Admin ID**: `FACULTY-001` (Permanent identifier)
- **Password**: `admin123`
- **Features**: Live metrics grid, Exam Builder, Question Set Creator, Student Directory with instant synchronization, Progress Tracker, and Gradebook Ledger with CSV export.

### Student Portal:
- **URL**: `/student/login`
- **Registration Number**: `ST-2024-001` (Alex Johnson) or `ST-2024-002` (Emma Watson)
- **Password**: `student123`
- **New Student Registration**: `/student/register` (Automatically saved in database and immediately visible to faculty).
- **Features**: Timed exam room, countdown timer, auto-submit on timer zero, **Single-Attempt Lock** (once completed, titles have no strikethrough and buttons are permanently disabled).

---

## 2. Key Architecture & Features

### A. Dual Portal Welcome Gateway (`/`)
- Professional gateway with dedicated cards for Faculty and Students.
- Direct link to the Student Coursework & Assignment Workspace.

### B. Admin / Faculty Console
- **Admin Dashboard**: Live metrics from MongoDB: Total Students, Total Exams, Active Exams, Completed Attempts, Pending Attempts, and Average Score.
- **Create Assignment / Exam**:
  - Title, Subject, Description, Instructions, Time Limit in Minutes, Start/End Dates, Class targeting.
  - Question Builder: Question prompt, Options A, B, C, D, Correct Answer selection, and Marks per question.
  - Draft vs. Publish controls (only published exams are delivered to students).
- **Student Details Directory**:
  - Instant synchronization when students register or log in.
  - Search by Name or Registration Number (`ST-2024-...`).
  - Department and Class filters, exams assigned, completion status, and average score.
- **Student Progress**:
  - Matrix showing each student's attempt state (`Not Started`, `In Progress`, `Submitted`).
  - Answer Sheet Inspection modal showing student's chosen option vs. correct option and points awarded.
- **Results Ledger**:
  - Gradebook with pass rate calculations and instant CSV export.

### C. Student Examination Room
- **One Attempt Only Rule**:
  - Database and backend enforce single attempt per exam (`{ studentId, examId }` compound unique constraint).
  - Clean card typography with **NO strikethrough lines** on completed exams.
  - Completed action button is permanently **disabled to click** (`[ ✓ Completed (Locked) ]`).
- **Live Timed Session**:
  - Synchronized countdown timer (MM:SS) with color alert under 5 minutes.
  - Question Palette (1..N) with status badges: Answered (Green), Flagged for Review (Amber), Unanswered (Gray).
  - Clear selection, previous/next question navigation.
  - Auto-submits answers when time runs out.
  - Anti-cheating security: server never transmits correct answers to the browser until graded!
- **Exam Result & Review**:
  - Full question-by-question breakdown with marks awarded, chosen answer, and correct solution.

---

## 3. Technology Stack

- **Frontend**:
  - React 19 SPA (Functional components & hooks)
  - React Router DOM v7
  - Tailwind CSS v4
  - Axios with JWT request interceptor
  - Lucide React icons
- **Backend**:
  - Node.js & Express.js
  - RESTful API endpoints
  - JWT Authentication & bcrypt password hashing
  - Mongoose ODM & MongoDB
  - Automatic persistent file store fallback (`data/*.json`) ensuring 100% functionality out-of-the-box.

---

## 4. Running the Application

```bash
# Install dependencies
npm install

# Start full-stack dev server on port 3000
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 5. MongoDB Configuration

Configure your `MONGODB_URI` in `.env`:

```env
# Local MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/student_examination_workspace

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/student_examination_workspace?retryWrites=true&w=majority
```
