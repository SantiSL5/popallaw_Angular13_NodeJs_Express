import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Profile } from '../models/profile';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private apiService: ApiService
  ) { }

  get(username: string): Observable<any> {
    return this.apiService.get('/profile/' + username)
      .pipe(map((data: { profile: Profile }) => data.profile));
  }

  follow(username: string): Observable<Profile> {
    return this.apiService.post('/profile/' + username + '/follow');
  }

  unfollow(username: string): Observable<Profile> {
    return this.apiService.delete('/profile/' + username + '/follow');
  }

  getFollowers(username: string, offset:number, limit:number): Observable<any> {
    let params = {
      "offset": offset,
      "limit": limit
    };
    return this.apiService.get('/profile/' + username + '/followers', new HttpParams({ fromObject: params }));
  }

  getFollowings(username: string, offset:number, limit:number): Observable<any> {
    let params = {
      "offset": offset,
      "limit": limit
    };
    return this.apiService.get('/profile/' + username + '/followings', new HttpParams({ fromObject: params }));
  }

  getLikes(username: string, offset:number, limit:number): Observable<any> {
    let params = {
      "offset": offset,
      "limit": limit
    };
    return this.apiService.get('/profile/' + username + '/likes', new HttpParams({ fromObject: params }));
  }
  
  getComments(username: string, offset:number, limit:number): Observable<any> {
    let params = {
      "offset": offset,
      "limit": limit
    };
    return this.apiService.get('/profile/' + username + '/comments', new HttpParams({ fromObject: params }));
  }

}
