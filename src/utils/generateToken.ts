import CryptoJS from 'crypto-js';
import { jwt_header, jwt_payload } from '@/constants';

export const generateJWT = () => {
  const header = jwt_header;
  const payload = jwt_payload;
  const secretKey = process.env.JWT_SECRET_KEY as string;

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signature = generateSignature(
    encodedHeader + '.' + encodedPayload,
    secretKey,
  );

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const base64UrlEncode = (data: string): string => {
  let base64 = CryptoJS.enc.Utf8.parse(data).toString(CryptoJS.enc.Base64);
  base64 = base64.replace(/=/g, '');
  base64 = base64.replace(/\+/g, '-');
  base64 = base64.replace(/\//g, '_');
  return base64;
};

const generateSignature = (data: string, secretKey: string): string => {
  const hmac = CryptoJS.HmacSHA256(data, secretKey);
  const signature = hmac.toString(CryptoJS.enc.Base64);
  return base64UrlEncode(signature);
};
