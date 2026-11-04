import { z } from 'zod';

export const roleSchema = z.enum(['user', 'admin', 'superadmin']);
export type AppRole = z.infer<typeof roleSchema>;
export const sessionUserSchema = z.object({
  id: z.union([z.number().int().positive(), z.string().min(1)]),
  email: z.string().email(),
  name: z.string().optional(),
  role: z
    .string()
    .transform((value) => value.toLowerCase())
    .pipe(roleSchema),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});
export type SessionUser = z.infer<typeof sessionUserSchema>;
export interface SessionResponse {
  user: SessionUser | null;
}
