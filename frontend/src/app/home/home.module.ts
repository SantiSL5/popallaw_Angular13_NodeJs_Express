import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCategoriesComponent } from '../shared/list-categories/list-categories.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ListCategoriesComponent,
    CommonModule,
    SharedModule,
    HomeModule
  ],
  imports: [
    CommonModule,
    HomeModule
  ]
})
export class HomeModule { }
