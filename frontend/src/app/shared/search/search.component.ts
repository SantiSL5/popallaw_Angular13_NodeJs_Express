import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService, Filters, ProductService } from 'src/app/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  search: String = '';
  filters!:Filters;
  @ViewChild("name") name!: ElementRef;

  constructor(
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public autoComplete(data: any): void {


  }

  public enterEvent(data: any): void {
    if (typeof data.search === 'string') {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.filters= {
          limit:6,
          offset:0
        }
        this.filters.name=data.search;
        this._productService.setFilters(this.filters,"search");
        
        setTimeout(()=>{
          this.router.navigate(
            ['/shop']
          );
        }, 50);
      });
    }
  }

  public buttonSearch() {
    if (this.name.nativeElement.value =! " ") {
      this.name.nativeElement.value=""
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.filters= {
          limit:6,
          offset:0
        }
        this.filters.name=this.name.nativeElement.value;
        this._productService.setFilters(this.filters,"search");
        setTimeout(()=>{
          this.router.navigate(
            ['/shop']
          );
        }, 50);
      });
    }else {
      this.name.nativeElement.value=""
    }
  }

}
