import type { AuthError } from '@supabase/supabase-js';

// Raw Supabase messages are English and may leak details, so only known codes get specific copy.
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Correo o contraseña incorrectos.',
  email_not_confirmed: 'Confirma tu correo antes de iniciar sesión.',
  user_already_exists: 'Ya existe una cuenta con este correo.',
  email_exists: 'Ya existe una cuenta con este correo.',
  weak_password: 'La contraseña es demasiado débil.',
  email_address_invalid: 'El correo no es válido.',
  signup_disabled: 'El registro no está disponible en este momento.',
  over_request_rate_limit: 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
  over_email_send_rate_limit: 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
};

const GENERIC_ERROR_MESSAGE = 'Ocurrió un error. Revisa tu conexión e inténtalo de nuevo.';

export const getAuthErrorMessage = (error: AuthError): string =>
  (error.code ? AUTH_ERROR_MESSAGES[error.code] : undefined) ?? GENERIC_ERROR_MESSAGE;
