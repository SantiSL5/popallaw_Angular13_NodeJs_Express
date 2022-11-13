import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Comment } from '../models';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  constructor(
    private apiService: ApiService
  ) { }

  getAll(slug: string): Observable<Comment[]> {
    return this.apiService.get(`/product/${slug}/comment`);
  }

  add(slug: string, body: any): Observable<Comment[]> {
    return this.apiService.post(`/product/${slug}/comment`, body);
  }

  delete(slug: string, comment: any): Observable<Comment[]> {
    return this.apiService.delete(`/product/${slug}/comment/${comment}`);
  }

}
