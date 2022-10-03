import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
// import { CarouselComponent } from './carousel/carousel.component';
// import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ScrollComponent } from './scroll/scroll.component';
// import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    HomeComponent,
    // CarouselComponent,
    // ScrollComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    // MdbCarouselModule,
    // NgbModule,
    // InfiniteScrollModule
  ]
})
export class HomeModule { }
