import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupportedStorage } from '@supabase/supabase-js';
import * as aesjs from 'aes-js';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

// SecureStore rejects large values, so it only holds the AES key; the encrypted session lives in AsyncStorage.
const KEY_LENGTH_BYTES = 32;

const encrypt = async (key: string, value: string): Promise<string> => {
  const encryptionKey = await Crypto.getRandomBytesAsync(KEY_LENGTH_BYTES);
  const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
  const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

  await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey));

  return aesjs.utils.hex.fromBytes(encryptedBytes);
};

const decrypt = async (key: string, encryptedValue: string): Promise<string | null> => {
  const encryptionKeyHex = await SecureStore.getItemAsync(key);
  if (!encryptionKeyHex) {
    return null;
  }

  const cipher = new aesjs.ModeOfOperation.ctr(
    aesjs.utils.hex.toBytes(encryptionKeyHex),
    new aesjs.Counter(1),
  );
  const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(encryptedValue));

  return aesjs.utils.utf8.fromBytes(decryptedBytes);
};

export const secureStorage: SupportedStorage = {
  getItem: async (key) => {
    const encryptedValue = await AsyncStorage.getItem(key);
    if (!encryptedValue) {
      return null;
    }

    return decrypt(key, encryptedValue);
  },
  setItem: async (key, value) => {
    const encryptedValue = await encrypt(key, value);

    await AsyncStorage.setItem(key, encryptedValue);
  },
  removeItem: async (key) => {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  },
};
