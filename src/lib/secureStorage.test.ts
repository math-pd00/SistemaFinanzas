import { secureStorage } from './secureStorage';

// In-memory stores and fixed key bytes make the encrypt/decrypt round trip deterministic without native modules.
const mockAsyncStorage = new Map<string, string>();
const mockSecureStore = new Map<string, string>();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async (key: string) => mockAsyncStorage.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      mockAsyncStorage.set(key, value);
    }),
    removeItem: jest.fn(async (key: string) => {
      mockAsyncStorage.delete(key);
    }),
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (key: string) => mockSecureStore.get(key) ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockSecureStore.set(key, value);
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    mockSecureStore.delete(key);
  }),
}));

jest.mock('expo-crypto', () => ({
  getRandomBytesAsync: jest.fn(async (byteCount: number) => new Uint8Array(byteCount).fill(7)),
}));

const STORAGE_KEY = 'sb-project-auth-token';
const SESSION = JSON.stringify({ access_token: 'access', refresh_token: 'refresh' });

beforeEach(() => {
  mockAsyncStorage.clear();
  mockSecureStore.clear();
});

describe('secureStorage', () => {
  it('returns the original value after storing it', async () => {
    await secureStorage.setItem(STORAGE_KEY, SESSION);

    await expect(secureStorage.getItem(STORAGE_KEY)).resolves.toBe(SESSION);
  });

  it('stores only hex ciphertext in AsyncStorage', async () => {
    await secureStorage.setItem(STORAGE_KEY, SESSION);

    const stored = mockAsyncStorage.get(STORAGE_KEY);
    expect(stored).not.toBe(SESSION);
    expect(stored).toMatch(/^[0-9a-f]+$/);
  });

  it('stores the 32-byte AES key in SecureStore', async () => {
    await secureStorage.setItem(STORAGE_KEY, SESSION);

    expect(mockSecureStore.get(STORAGE_KEY)).toBe('07'.repeat(32));
  });

  it('returns null when nothing is stored', async () => {
    await expect(secureStorage.getItem(STORAGE_KEY)).resolves.toBeNull();
  });

  it('returns null when the AES key is missing', async () => {
    await secureStorage.setItem(STORAGE_KEY, SESSION);
    mockSecureStore.clear();

    await expect(secureStorage.getItem(STORAGE_KEY)).resolves.toBeNull();
  });

  it('removes both the ciphertext and the AES key', async () => {
    await secureStorage.setItem(STORAGE_KEY, SESSION);
    await secureStorage.removeItem(STORAGE_KEY);

    expect(mockAsyncStorage.has(STORAGE_KEY)).toBe(false);
    expect(mockSecureStore.has(STORAGE_KEY)).toBe(false);
  });
});
