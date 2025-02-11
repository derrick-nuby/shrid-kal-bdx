import * as crypto from "crypto-js";
import * as process from "process";

interface TokenPayload {
  userId: unknown;
  email: string;
  exp: number;
}

export function createEncryptedToken(userId: unknown, email: string): string {
  const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;
  const EXPIRATION_TIME = parseInt(process.env.TOKEN_EXPIRATION_TIME || '3600', 10);

  if (!SECRET_KEY) {
    throw new Error('CRYPTO_SECRET_KEY environment variable is not set');
  }

  const payload: TokenPayload = {
    userId,
    email,
    exp: Math.floor(Date.now() / 1000) + EXPIRATION_TIME,
  };

  const token = JSON.stringify(payload);
  const encrypted = crypto.AES.encrypt(token, SECRET_KEY).toString();

  return encrypted
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decryptToken(encryptedToken: string): TokenPayload {
  const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

  if (!SECRET_KEY) {
    throw new Error('CRYPTO_SECRET_KEY environment variable is not set');
  }

  const base64 = encryptedToken
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const pad = base64.length % 4;
  const paddedBase64 = pad
    ? base64 + '='.repeat(4 - pad)
    : base64;

  const bytes = crypto.AES.decrypt(paddedBase64, SECRET_KEY);
  const decrypted = bytes.toString(crypto.enc.Utf8);

  if (!decrypted) {
    throw new Error('Decryption failed');
  }

  const payload: TokenPayload = JSON.parse(decrypted);

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token has expired');
  }

  return payload;
}
