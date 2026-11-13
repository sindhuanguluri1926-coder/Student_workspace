import express from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  updateAssignmentStatus,
} from '../controllers/assignmentController.js';

const router = express.Router();

router.route('/')
  .post(createAssignment)
  .get(getAssignments);

router.route('/:id')
  .get(getAssignmentById)
  .put(updateAssignment)
  .delete(deleteAssignment);

router.route('/:id/status')
  .patch(updateAssignmentStatus);

export default router;
