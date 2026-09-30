import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupportedStorage } from '@supabase/supabase-js';
import * as aesjs from 'aes-js';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

// SecureStore rejects large values, so it only holds the AES key; the encrypted session lives in AsyncStorage.
const LONGITUD_CLAVE_BYTES = 32;

const cifrar = async (clave: string, valor: string): Promise<string> => {
  const claveCifrado = await Crypto.getRandomBytesAsync(LONGITUD_CLAVE_BYTES);
  const cipher = new aesjs.ModeOfOperation.ctr(claveCifrado, new aesjs.Counter(1));
  const bytesCifrados = cipher.encrypt(aesjs.utils.utf8.toBytes(valor));

  await SecureStore.setItemAsync(clave, aesjs.utils.hex.fromBytes(claveCifrado));

  return aesjs.utils.hex.fromBytes(bytesCifrados);
};

const descifrar = async (clave: string, valorCifrado: string): Promise<string | null> => {
  const claveCifradoHex = await SecureStore.getItemAsync(clave);
  if (!claveCifradoHex) {
    return null;
  }

  const cipher = new aesjs.ModeOfOperation.ctr(
    aesjs.utils.hex.toBytes(claveCifradoHex),
    new aesjs.Counter(1),
  );
  const bytesDescifrados = cipher.decrypt(aesjs.utils.hex.toBytes(valorCifrado));

  return aesjs.utils.utf8.fromBytes(bytesDescifrados);
};

export const almacenamientoSeguro: SupportedStorage = {
  getItem: async (clave) => {
    const valorCifrado = await AsyncStorage.getItem(clave);
    if (!valorCifrado) {
      return null;
    }

    return descifrar(clave, valorCifrado);
  },
  setItem: async (clave, valor) => {
    const valorCifrado = await cifrar(clave, valor);

    await AsyncStorage.setItem(clave, valorCifrado);
  },
  removeItem: async (clave) => {
    await AsyncStorage.removeItem(clave);
    await SecureStore.deleteItemAsync(clave);
  },
};
