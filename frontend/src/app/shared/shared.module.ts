import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { HeaderComponent } from './header/header.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { CarouselComponent } from './carousel/carousel.component';


@NgModule({
  declarations: [
    ListCategoriesComponent,
    ListProductsComponent,
    HeaderComponent,
    InfiniteScrollComponent,
    CarouselComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    InfiniteScrollModule,
    MdbCarouselModule
  ],
  exports: [
    ListCategoriesComponent,
    ListProductsComponent,
    HeaderComponent,
    InfiniteScrollComponent,
    CarouselComponent
  ]
})
export class SharedModule { }