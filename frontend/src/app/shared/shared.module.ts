import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    ListCategoriesComponent,
    ListProductsComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
  ],
  exports: [
    ListCategoriesComponent,
    ListProductsComponent,
    HeaderComponent
  ]
})
export class SharedModule { }