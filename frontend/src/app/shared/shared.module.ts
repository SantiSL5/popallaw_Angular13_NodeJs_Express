import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { HeaderComponent } from './header/header.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    ListCategoriesComponent,
    ListProductsComponent,
    HeaderComponent,
    InfiniteScrollComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    InfiniteScrollModule
  ],
  exports: [
    ListCategoriesComponent,
    ListProductsComponent,
    HeaderComponent,
    InfiniteScrollComponent
  ]
})
export class SharedModule { }