import { z } from 'zod';
import { ObjectId } from 'mongodb';

// Zod schema for User validation
export const UserSchema = z.object({
  email: z.string()
    .email('Please provide a valid email')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

// Zod schema for User document (includes _id and timestamps)
export const UserDocumentSchema = UserSchema.extend({
  _id: z.instanceof(ObjectId),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// TypeScript types inferred from zod schemas
export type IUser = z.infer<typeof UserSchema>;
export type IUserDocument = z.infer<typeof UserDocumentSchema>;

// User input type (for creating users)
export type CreateUserInput = z.infer<typeof UserSchema>;

// Zod schema for User update validation (partial schema)
export const UpdateUserSchema = UserSchema.partial();

// User update input type
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

