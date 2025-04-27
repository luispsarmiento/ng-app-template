import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
  HttpContext,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';

import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken(){
  return new HttpContext().set(CHECK_TOKEN, true);
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
      null
  );
  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this._intercept(request, next).pipe(
      catchError((error: HttpErrorResponse): Observable<HttpEvent<unknown>> => {
        if (request.url.includes("auth")) {
            // We do another check to see if refresh token failed
            // In this case we want to logout user and to redirect it to login page
  
            //if (request.url.includes("refreshtoken")) {
            //    this.auth.logout();
            //}
  
            return throwError(error);
        }
  
        if (error.status !== 401) {
            return throwError(error);
        }
  
        if (this.refreshTokenInProgress) {
            // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
            // – which means the new token is ready and we can retry the request again
            return this.refreshTokenSubject.pipe(
              filter(result => result !== null),
              take(1),
              switchMap(() => this.addToken(request, next))
            );
        } else {
            this.refreshTokenInProgress = true;
  
            // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
            this.refreshTokenSubject.next(null);
  
            // Call auth.refreshAccessToken(this is an Observable that will be returned)
            const rt = this.tokenService.getRefreshToken() || "";
            return this.authService.refreshToken(rt).pipe(
              switchMap((response: any) =>{
                const token = this.tokenService.get();
                this.refreshTokenInProgress = false;
                this.refreshTokenSubject.next(token);

                return this.addToken(request, next);
              }),
              catchError((error: HttpErrorResponse) => {
                this.refreshTokenInProgress = false;
                this.authService.logout();
                return throwError(error);
              })
            );
        }
      })
    );
  }

  private _intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>{
    if (request.context.get(CHECK_TOKEN)){
      return this.addToken(request, next);//next.handle(request);
    }

    return next.handle(request);
  }

  private addToken(request: HttpRequest<unknown>, next: HttpHandler){
    const token = this.tokenService.get();
    if (token){
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(authRequest);
    }

    return next.handle(request);
  }
}
