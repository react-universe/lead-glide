import { z } from 'zod';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

// Auth validation schemas
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
});

// Prospect validation schema
export const prospectSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone || phone.trim() === '') return true;
      return isValidPhoneNumber(phone);
    }, 'Please enter a valid phone number'),
  company: z
    .string()
    .max(100, 'Company name must not exceed 100 characters')
    .optional(),
  stage: z.enum(['new', 'in_talks', 'closed'], {
    required_error: 'Please select a pipeline stage',
  }),
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional(),
});

// Type exports
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ProspectFormData = z.infer<typeof prospectSchema>;

// Phone number validation helper
export const validatePhoneNumber = (phone: string, country?: string) => {
  if (!phone || phone.trim() === '') return { isValid: true };
  
  try {
    const phoneNumber = parsePhoneNumber(phone, country as any);
    return {
      isValid: phoneNumber ? phoneNumber.isValid() : false,
      formatted: phoneNumber ? phoneNumber.formatInternational() : phone,
      country: phoneNumber ? phoneNumber.country : undefined,
    };
  } catch {
    return { isValid: false };
  }
};