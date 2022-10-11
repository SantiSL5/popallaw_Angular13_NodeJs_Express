import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { ToastrModule } from 'ngx-toastr';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    InfiniteScrollModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
    }),
    MdbCarouselModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
