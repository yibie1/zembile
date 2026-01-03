import { Router, Request, Response } from 'express';
// import { UploadController } from '@/controllers/UploadController';
import { authenticate } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();
// const uploadController = new UploadController();

/**
 * @route   POST /api/uploads/image
 * @desc    Upload single image
 * @access  Private
 */
router.post('/image', authenticate, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Image upload endpoint - Coming soon in TypeScript!',
    data: null
  });
});

/**
 * @route   POST /api/uploads/images
 * @desc    Upload multiple images
 * @access  Private
 */
router.post('/images', authenticate, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Multiple image upload endpoint - Coming soon in TypeScript!',
    data: []
  });
});

/**
 * @route   DELETE /api/uploads/:filename
 * @desc    Delete uploaded file
 * @access  Private
 */
router.delete('/:filename', authenticate, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'File deletion endpoint - Coming soon in TypeScript!'
  });
});

export default router;