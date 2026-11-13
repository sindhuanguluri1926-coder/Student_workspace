import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  selectedOption: {
    type: String,
    enum: ['A', 'B', 'C', 'D', null],
    default: null,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  marksAwarded: {
    type: Number,
    default: 0,
  },
});

const examAttemptSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    examTitle: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    answers: [answerSchema],
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 10,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    result: {
      type: String,
      enum: ['Pass', 'Fail', 'Pending'],
      default: 'Pending',
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Submitted'],
      default: 'In Progress',
    },
  },
  {
    timestamps: true,
  }
);

// Compound Unique Index: A student can attempt each exam only ONCE
examAttemptSchema.index({ studentId: 1, examId: 1 }, { unique: true });

examAttemptSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

const ExamAttempt = mongoose.models.ExamAttempt || mongoose.model('ExamAttempt', examAttemptSchema);

export default ExamAttempt;
