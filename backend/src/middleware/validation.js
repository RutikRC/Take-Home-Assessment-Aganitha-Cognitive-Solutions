import { body, param, validationResult } from 'express-validator';

export const validateCreateLink = [
  body('target_url')
    .notEmpty()
    .withMessage('URL is required')
    .isURL({ require_protocol: true })
    .withMessage('Must be a valid URL with protocol (http:// or https://)'),
  body('code')
    .optional()
    .matches(/^[A-Za-z0-9]{6,8}$/)
    .withMessage('Code must be 6-8 alphanumeric characters'),
];

export const validateCode = [
  param('code')
    .matches(/^[A-Za-z0-9]{6,8}$/)
    .withMessage('Code must be 6-8 alphanumeric characters'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

