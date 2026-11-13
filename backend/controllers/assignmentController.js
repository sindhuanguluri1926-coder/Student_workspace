import Assignment from '../models/Assignment.js';

/**
 * @desc    Create a new assignment
 * @route   POST /api/assignments
 * @access  Public
 */
export const createAssignment = async (req, res, next) => {
  try {
    const { title, subject, description, deadline, priority, status } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Assignment title is required');
    }
    if (!subject || !subject.trim()) {
      res.status(400);
      throw new Error('Subject name is required');
    }
    if (!deadline) {
      res.status(400);
      throw new Error('Deadline date is required');
    }

    const assignment = await Assignment.create({
      title: title.trim(),
      subject: subject.trim(),
      description: description ? description.trim() : '',
      deadline: new Date(deadline),
      priority: priority || 'Medium',
      status: status || 'Pending',
    });

    res.status(201).json({
      success: true,
      data: assignment,
      message: 'Assignment created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all assignments with optional search, filter, and sorting
 * @route   GET /api/assignments
 * @access  Public
 */
export const getAssignments = async (req, res, next) => {
  try {
    const { search, subject, priority, status, sort } = req.query;

    const query = {};

    // Search by title or subject
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { subject: searchRegex }];
    }

    // Filter by subject
    if (subject && subject !== 'All') {
      query.subject = subject;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Filter by status (including virtual Overdue if specified)
    if (status && status !== 'All') {
      if (status === 'Overdue') {
        query.status = 'Pending';
        query.deadline = { $lt: new Date() };
      } else {
        query.status = status;
      }
    }

    // Build sort
    let sortOption = { deadline: 1 }; // Default: earliest deadline first
    if (sort === 'deadline_desc') {
      sortOption = { deadline: -1 };
    } else if (sort === 'created_desc') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'created_asc') {
      sortOption = { createdAt: 1 };
    }

    const assignments = await Assignment.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single assignment by ID
 * @route   GET /api/assignments/:id
 * @access  Public
 */
export const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      res.status(404);
      throw new Error(`Assignment not found with id ${req.params.id}`);
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update assignment details
 * @route   PUT /api/assignments/:id
 * @access  Public
 */
export const updateAssignment = async (req, res, next) => {
  try {
    const { title, subject, description, deadline, priority, status } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      res.status(404);
      throw new Error(`Assignment not found with id ${req.params.id}`);
    }

    if (title !== undefined) {
      if (!title.trim()) {
        res.status(400);
        throw new Error('Title cannot be empty');
      }
      assignment.title = title.trim();
    }

    if (subject !== undefined) {
      if (!subject.trim()) {
        res.status(400);
        throw new Error('Subject cannot be empty');
      }
      assignment.subject = subject.trim();
    }

    if (description !== undefined) {
      assignment.description = description.trim();
    }

    if (deadline !== undefined) {
      if (!deadline) {
        res.status(400);
        throw new Error('Deadline cannot be empty');
      }
      assignment.deadline = new Date(deadline);
    }

    if (priority !== undefined) {
      assignment.priority = priority;
    }

    if (status !== undefined) {
      assignment.status = status;
    }

    const updatedAssignment = await assignment.save();

    res.status(200).json({
      success: true,
      data: updatedAssignment,
      message: 'Assignment updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an assignment
 * @route   DELETE /api/assignments/:id
 * @access  Public
 */
export const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      res.status(404);
      throw new Error(`Assignment not found with id ${req.params.id}`);
    }

    await assignment.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update assignment status (Pending / Completed)
 * @route   PATCH /api/assignments/:id/status
 * @access  Public
 */
export const updateAssignmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'Completed'].includes(status)) {
      res.status(400);
      throw new Error('Status must be either Pending or Completed');
    }

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      res.status(404);
      throw new Error(`Assignment not found with id ${req.params.id}`);
    }

    assignment.status = status;
    const updated = await assignment.save();

    res.status(200).json({
      success: true,
      data: updated,
      message: `Assignment marked as ${status}`,
    });
  } catch (error) {
    next(error);
  }
};
