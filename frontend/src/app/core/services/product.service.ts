import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { Product } from '../models/product';
import { Filters } from '../models/filters';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private productsSubject = new BehaviorSubject<any>({} as any);

  public products = this.productsSubject.asObservable();

  private filtersSubject = new BehaviorSubject<Filters>({} as Filters);

  public filters = this.filtersSubject.asObservable();

  filtersServ: Filters = {
    limit: 6,
    offset: 0
  };
  urlParams: any = [];
  defaultFilters: Filters = {
    limit: 6,
    offset: 0
  };

  // filtersSubject.next(defaultFilters);

  constructor(
    private apiService: ApiService
  ) { }

  getFilters(): Filters {
    return this.filtersSubject.value;
  }

  async setFilters(filters: Filters, call: string = "undefined") {
    this.filtersServ = this.getFilters();
    if (call == "category") {
      filters.priceMin = undefined;
      filters.priceMax = undefined;
      this.filtersSubject.next({ ...this.filtersSubject.value, ...filters });
    } else if (call == "slider") {
      this.filtersSubject.next({ ...this.filtersSubject.value, ...filters });
    } else if (call == "pagination") {
      this.filtersSubject.next({ ...this.filtersSubject.value, ...filters });
    } else {
      filters.priceMin = this.getProducts().minprice;
      filters.priceMax = this.getProducts().maxprice;
      this.filtersSubject.next(filters);
    }
    await this.refreshProducts();
  }

  setProducts(products: any) {
    this.productsSubject.next(products);
  }

  getProducts(): any {
    return this.productsSubject.value;
  }

  async refreshProducts() {
    await this.query(this.filtersSubject.value).subscribe(data => {
      this.setProducts(data);
      //hacerlo false cuando  en el filters
    });
  }

  query(filters: Filters): Observable<any> {
    let params = {};
    params = filters;

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

  put(slug: string, product: Product): Observable<any> {
    return this.apiService.put('/product/' + slug, product);
  }

  favProduct(slug: string): Observable<any> {
    return this.apiService.post('/product/' + slug + '/fav');
  }

  unfavProduct(slug: string): Observable<Product> {
    return this.apiService.delete('/product/' + slug + '/fav');
  }

}
