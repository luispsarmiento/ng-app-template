import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import CryptoES from 'crypto-es';
import { JwtPayload, jwtDecode } from 'jwt-decode';

const COOKIE_KEY: string = "_mt_todo_app_session_id"; 
const COOKIE_KEY_1: string = "_mt_todo_app_A";
const COOKIE_KEY_2: string = "_mt_todo_app_B";
const bytesToBase64Encode = (bytes: any) => {
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
};
const RandomNumber = () => (Math.floor(Math.random() * 1000) + 1)
const UniqueStringId = () => bytesToBase64Encode(new TextEncoder().encode(`${RandomNumber()}`))+"-"+bytesToBase64Encode(new TextEncoder().encode(`${Date.now()}`))+"-"+bytesToBase64Encode(new TextEncoder().encode(`${RandomNumber()}`))

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveRefreshToken(apiKey: string){
    const _key = UniqueStringId();

    const _apiKeyEncrypted = CryptoES.AES.encrypt(apiKey, _key);

    setCookie(COOKIE_KEY, _key, {expires: 14, path: '/', secure: true})
    setCookie(COOKIE_KEY_2, _apiKeyEncrypted.toString(), {expires: 14, path: '/', secure: true});
  }

  getRefreshToken(){
    const token = getCookie(COOKIE_KEY_2) ?? "";
    const _key = getCookie(COOKIE_KEY) ?? "";

    const decrypted = CryptoES.AES.decrypt(token, _key);

    return decrypted.toString(CryptoES.enc.Utf8);
  }

  save(token: string){
    setCookie(COOKIE_KEY_1, token, {expires: 365, path: '/', secure: true});
  }

  get(){
    const token = getCookie(COOKIE_KEY_1);

    return token;
  }

  remove(){
    removeCookie(COOKIE_KEY);
    removeCookie(COOKIE_KEY_1);
    removeCookie(COOKIE_KEY_2);
  }

  isValidToken(){
    const token = this.get();
    if (!token) {
      return false;
    }

    const decodeExpToken = this.decodeExpToken(token);

    if(decodeExpToken){
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeExpToken);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }

    return false;
  }

  isValidRefreshToken(){
    const token = this.getRefreshToken();
    if (!token) {
      return false;
    }

    const decodeExpToken = this.decodeExpToken(token);

    if(decodeExpToken){
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeExpToken);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }

    return true;
  }

  private decodeExpToken(token: string){
    let exp: number = 0;
    const _decodeExptoken = jwtDecode<JwtPayload>(token);
    if (_decodeExptoken && _decodeExptoken?.exp){
      return _decodeExptoken.exp;
    }
    return exp;
  }
}
