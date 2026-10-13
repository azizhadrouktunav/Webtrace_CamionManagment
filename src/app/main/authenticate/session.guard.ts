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
    if (url === '/' || url === '/app-auth') {
      this.openDemoSession();
      this.router.navigate(['/Home']);
      return false;
    }

    const loggedIn = this._authenticateService.isLoggedIn() && !!localStorage.getItem('SessionId');
    if (loggedIn) {
      return true;
    }

    this.openDemoSession();
    this.router.navigate(['/Home']);
    return false;
  }

  private openDemoSession(): void {
    if (this._authenticateService.isLoggedIn() && localStorage.getItem('SessionId')) {
      return;
    }
    localStorage.setItem('STATE', 'true');
    localStorage.setItem('SessionId', 'MOCK-SESSION-DEMO');
    localStorage.setItem('isParcAuthorized', 'isParcAuthorized');
    localStorage.setItem('isSuiviAuthorized', 'isSuiviAuthorized');
    localStorage.setItem('isAdminAuthorized', 'isAdminAuthorized');
    localStorage.setItem('isMonitoringTankAuthorized', 'isMonitoringTankAuthorized');
    localStorage.setItem('AccessRightsOfCurrentAccount', JSON.stringify({
      '3': true,
      '14': true,
      '15': true,
      '17': true,
      '22': true,
      '28': true
    }));
    localStorage.setItem('UserName', 'Demo Orient');
    localStorage.setItem('CustomerGMT', '+01:00');
    localStorage.setItem('Customer', 'TUNAV Orient Demo');
    localStorage.setItem('AuthDate', JSON.stringify((new Date()).getTime()));
  }
}
