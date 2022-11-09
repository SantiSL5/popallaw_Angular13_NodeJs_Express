import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '../services/user.service';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    this.userService.isAuthenticated.subscribe(isAuth => {
      if (isAuth) {
        this.router.navigateByUrl('/login');
      }
    })
    return this.userService.isAuthenticated.pipe(take(1), map(isAuth => isAuth));

  }
}
