import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ListProductsComponent } from './list-products/list-products.component';
import { HeaderComponent } from './header/header.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxPaginationModule } from 'ngx-pagination';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { CarouselComponent } from './carousel/carousel.component';
import { DetailsProductComponent } from './details-product/details-product.component';
import { PaginationComponent } from './pagination/pagination.component';


@NgModule({
  declarations: [
    ListProductsComponent,
    HeaderComponent,
    InfiniteScrollComponent,
    CarouselComponent,
    DetailsProductComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    InfiniteScrollModule,
    MdbCarouselModule,
    NgxPaginationModule
  ],
  exports: [
    ListProductsComponent,
    HeaderComponent,
    InfiniteScrollComponent,
    CarouselComponent,
    DetailsProductComponent,
    PaginationComponent
  ]
})
export class SharedModule { }