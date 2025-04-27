import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, of, take } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService
  ){

  }
  canActivate(): boolean | Observable<boolean> | Promise<boolean> {
    const token = this.tokenService.isValidToken();
    if (token){
      return true;
    }
    return this.checkLogin()
  }

  protected checkLogin():Observable<boolean> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (refreshToken == ""){
      this.router.navigate(['/login']);
      return of(false);
    }
    return this.authService.refreshToken(this.tokenService.getRefreshToken()).pipe(
      map((_) => {
        const allowLogin = this.tokenService.isValidToken();

        if (!allowLogin) {
          this.router.navigate(['/login'])
        }

        return allowLogin
      }),
      take(1)
    )
  }
  
}
