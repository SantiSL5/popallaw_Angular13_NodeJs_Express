import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ListProductsComponent } from './list-products/list-products.component';
import { HeaderComponent } from './header/header.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { CarouselComponent } from './carousel/carousel.component';
import { DetailsProductComponent } from './details-product/details-product.component';
import { PaginationComponent } from './pagination/pagination.component';
import { FiltersComponent } from './filters/filters.component';
import { SearchComponent } from './search/search.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ShowAuthedDirective } from './show-authed.directive'


@NgModule({
  declarations: [
    ListProductsComponent,
    HeaderComponent,
    InfiniteScrollComponent,
    CarouselComponent,
    DetailsProductComponent,
    PaginationComponent,
    FiltersComponent,
    SearchComponent,
    ShowAuthedDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    InfiniteScrollModule,
    MdbCarouselModule,
    FormsModule,
    NgxSliderModule
  ],
  exports: [
    ListProductsComponent,
    HeaderComponent,
    InfiniteScrollComponent,
    CarouselComponent,
    DetailsProductComponent,
    PaginationComponent,
    FiltersComponent,
    SearchComponent
  ]
})
export class SharedModule { }