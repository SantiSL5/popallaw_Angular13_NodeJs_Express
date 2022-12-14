import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filters, Category, CategoryService, ProductService } from 'src/app/core';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.css']
})
export class InfiniteScrollComponent implements OnInit {

  listCategories: Category[] = [];
  limit: number = 2;
  offset: number = 0;
  filters!:Filters;

  constructor(
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getScroll();
  }

  getScroll() {
    this._categoryService.query(this.offset, this.limit).subscribe(data => {
      this.listCategories.push.apply(this.listCategories, data);
    })
  }

  onScrollDown() {
    this.offset = this.offset + 2;
    this.getScroll();
  }

  goShop(slug: string) {
    this.filters= {
      limit:6,
      offset:0
    }
    this.filters.category=slug;
    this._productService.setFilters(this.filters,"category");
    setTimeout(()=>{
      this.router.navigate(
        ['/shop']
      );
    }, 50);
  }

}