import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: [80, 'Subject cannot exceed 80 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline date is required'],
    },
    priority: {
      type: String,
      required: true,
      enum: {
        values: ['High', 'Medium', 'Low'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['Pending', 'Completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property to check if assignment is overdue
assignmentSchema.virtual('isOverdue').get(function () {
  if (this.status === 'Completed') return false;
  return new Date(this.deadline) < new Date();
});

// Configure JSON serialization to include virtuals and format _id
assignmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);

export default Assignment;
