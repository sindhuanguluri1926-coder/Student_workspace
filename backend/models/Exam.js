import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: [true, 'Question prompt is required'],
    trim: true,
  },
  optionA: {
    type: String,
    required: [true, 'Option A is required'],
    trim: true,
  },
  optionB: {
    type: String,
    required: [true, 'Option B is required'],
    trim: true,
  },
  optionC: {
    type: String,
    required: [true, 'Option C is required'],
    trim: true,
  },
  optionD: {
    type: String,
    required: [true, 'Option D is required'],
    trim: true,
  },
  correctAnswer: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: [true, 'Correct answer is required'],
  },
  marks: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
});

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Exam title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    instructions: {
      type: String,
      default: 'Read each question carefully. Select the best option. Exam will auto-submit when the time limit expires.',
      trim: true,
    },
    questions: [questionSchema],
    totalMarks: {
      type: Number,
      required: true,
      default: 10,
    },
    duration: {
      type: Number,
      required: [true, 'Time limit in minutes is required'],
      default: 30, // in minutes
      min: 1,
    },
    assignedClass: {
      type: String,
      default: 'All',
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Closed'],
      default: 'Draft',
    },
    createdBy: {
      type: String,
      default: 'FACULTY-001',
    },
  },
  {
    timestamps: true,
  }
);

examSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);

export default Exam;
