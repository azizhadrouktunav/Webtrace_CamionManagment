import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';

@Injectable()
export class SessionGuard implements CanActivateChild, CanActivate {
  constructor(
    private router: Router,
    private _authenticateService: AuthenticateService
  ) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkPermission(state.url);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkPermission(state.url);
  }

  checkPermission(url: string): boolean {
    const loggedIn = this._authenticateService.isLoggedIn() && !!localStorage.getItem('SessionId');

    if (loggedIn) {
      if (url === '/' || url === '/app-auth') {
        this.router.navigate(['/Home']);
      }
      return true;
    }

    if (url === '/' || url === '/app-auth') {
      return true;
    }

    this.router.navigate(['app-auth']);
    return false;
  }
}
