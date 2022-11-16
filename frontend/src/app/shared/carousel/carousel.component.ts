import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Filters, ProductService } from 'src/app/core';
import { Category } from 'src/app/core/models/category';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @ViewChild('carousel', { static: false }) carousel: any;

  listCategories: Category[] = [];
  filters!:Filters;

  constructor(
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this._categoryService.query().subscribe(data => {
      this.listCategories = data;
    });
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
