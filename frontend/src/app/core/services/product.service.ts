import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { Product } from '../models/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  constructor(
    private apiService: ApiService
  ) { }

  query(): Observable<any> {
    const params = {};

    return this.apiService.get(
      '/product',
      new HttpParams({ fromObject: params })
    );
  }

  get(slug: string): Observable<Product> {
    return this.apiService.get('/product/' + slug);
  }

  destroy(slug: string) {
    return this.apiService.delete('/product/' + slug);
  }

  save(product: Product): Observable<Product> {
    return this.apiService.post('/product/', product);
  }

  put(slug: string, product: Product): Observable<Product> {
    return this.apiService.put('/product/' + slug, product);
  }
}
