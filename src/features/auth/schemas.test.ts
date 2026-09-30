import { signInSchema, signUpSchema } from './schemas';

// These rules are the only validation contract the auth screens rely on.
describe('signInSchema', () => {
  it('accepts a valid email and an 8-character password', () => {
    const result = signInSchema.safeParse({ email: 'ana@example.com', password: '12345678' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = signInSchema.safeParse({ email: 'ana', password: '12345678' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['email']);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = signInSchema.safeParse({ email: 'ana@example.com', password: '1234567' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['password']);
  });
});

describe('signUpSchema', () => {
  it('accepts matching passwords', () => {
    const result = signUpSchema.safeParse({
      email: 'ana@example.com',
      password: '12345678',
      confirmPassword: '12345678',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords on confirmPassword', () => {
    const result = signUpSchema.safeParse({
      email: 'ana@example.com',
      password: '12345678',
      confirmPassword: '87654321',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['confirmPassword']);
  });
});
