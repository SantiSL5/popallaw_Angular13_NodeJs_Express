import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '../services/user.service';
import { map, take } from 'rxjs/operators';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log(this.userService.isAuthenticated);

    // if (!this.userService.getIsAuthenticated()) {
    //   this.router.navigateByUrl('/');
    // }
    return this.userService.isAuthenticated.pipe(take(1), map(isAuth => !isAuth));

  }
}
