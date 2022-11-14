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
        this.filters=this._productService.getFilters();
        this.filters.name=data.search;
        this._productService.setFilters(this.filters,"search");
        this.router.navigate(
            ['/shop'],
            { queryParams: { filters: btoa(JSON.stringify(this.filters)) } }
        );
      });
    }
  }

  public buttonSearch() {
    if (this.name.nativeElement.value =! " ") {
      this.name.nativeElement.value=""
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.filters=this._productService.getFilters();
        this.filters.name=this.name.nativeElement.value;
        console.log(this.filters);
        this._productService.setFilters(this.filters,"search");
        this.router.navigate(
            ['/shop'],
            { queryParams: { filters: btoa(JSON.stringify(this.filters)) } }
        );
      });
    }else {
      this.name.nativeElement.value=""
    }
  }

}
