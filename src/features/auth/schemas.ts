import { z } from 'zod';

// Messages are shown to the user as-is by the auth screens.
const email = z.email('Ingresa un correo válido.');
const password = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.');

export const signInSchema = z.object({ email, password });

export const signUpSchema = z
  .object({ email, password, confirmPassword: z.string() })
  .refine((values) => values.password === values.confirmPassword, {
    error: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
