import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, distinctUntilChanged, catchError } from 'rxjs/operators';
import { JwtService } from './jwt.service';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) { }


  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {

      this.http.get(environment.urlUser)
        .subscribe(data => {
          this.setAuth(data);
        });

    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: any) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type: string | String, credentials: any): Observable<any> {
    const route = (type === 'login') ? '/login' : '/register';
    const path = "/user" + route;


    return this.login('/user' + route, credentials).pipe(map(data => {
      if (data.msg == undefined) {
        this.setAuth(data);
        this.router.navigateByUrl('/');
      } else {
        if ((type === 'login')) {
          this.toastr.error(data.msg, 'Login');
        } else {
          console.log(data);
        }
      }
    }))
  }

  login(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      body
    );
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

}
