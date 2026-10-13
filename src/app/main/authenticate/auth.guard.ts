
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private authService: AuthenticateService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }


  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    
    if (this.authService.isLoggedIn()) {
      const userRole = this.authService.getRole();
      if (route.data.role && userRole.indexOf(route.data.role) === -1) {
        this.router.navigate(['/403']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/app-auth']);
    return false;
  }
}