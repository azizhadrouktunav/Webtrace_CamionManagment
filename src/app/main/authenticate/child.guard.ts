import { Injectable } from '@angular/core';
import { Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';

@Injectable()
export class ChildGuard implements CanActivateChild {
  constructor(
    private router: Router,
    private _authenticateService: AuthenticateService
  ) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this._authenticateService.isLoggedIn()) {
      this.router.navigate(['app-auth']);
      return false;
    }
    return true;
  }
}
