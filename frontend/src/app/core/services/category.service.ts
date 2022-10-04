import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { Category } from '../models/category';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  constructor(
    private apiService: ApiService
  ) { }

  query(offset: number = 0, limit: number = 0): Observable<Category[]> {
    let params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit);

    return this.apiService.get(
      '/category/',
      params
    );
  }

  // query(): Observable<Category[]> {
  //   const params = {};

  //   return this.apiService.get(
  //     '/category',
  //     new HttpParams({ fromObject: params })
  //   );
  // }

  get(slug: string): Observable<Category> {
    return this.apiService.get('/category/' + slug);
  }

  destroy(slug: string) {
    return this.apiService.delete('/category/' + slug);
  }

  save(category: Category): Observable<Category> {
    return this.apiService.post('/category/', category);
  }

  put(slug: string, category: Category): Observable<Category> {
    return this.apiService.put('/category/' + slug, category);
  }
}
