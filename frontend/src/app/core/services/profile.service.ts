import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Profile } from '../models/profile';
import { map } from 'rxjs/operators';

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

  getFollowers(username: string): Observable<Profile> {
    return this.apiService.get('/profile/' + username + '/followers');
  }

  getFollowings(username: string): Observable<Profile> {
    return this.apiService.get('/profile/' + username + '/followings');
  }

  getLikes(username: string): Observable<Profile> {
    return this.apiService.get('/profile/' + username + '/likes');
  }
  
  getComments(username: string): Observable<Profile> {
    return this.apiService.get('/profile/' + username + '/comments');
  }

}
