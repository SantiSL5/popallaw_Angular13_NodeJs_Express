import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/core/models/category';
import { Filters } from 'src/app/core/models/filters';
import { CategoryService } from 'src/app/core/services/category.service';
import { Options, LabelType, CustomStepDefinition } from '@angular-slider/ngx-slider';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  maxValue= this._productService.getProducts().maxprice;
  minValue= this._productService.getProducts().minprice;
  @Output() filtersChange = new EventEmitter<Filters>();
  listCategories: Category[] = [];
  selectedValue: string = '';
  filters: Filters = {
    category: undefined
  };
  options!: Options;

  constructor(
      private _categoryService: CategoryService,
      private _productService: ProductService
    ) {
  }

  ngOnInit(): void {
    this.maxValue= this._productService.getProducts().maxprice;
    this.minValue= this._productService.getProducts().minprice;
    this.options= {
      floor: this.minValue,
      ceil: this.maxValue,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return '<b>Min price:</b> €' + value;
          case LabelType.High:
            return '<b>Max price:</b> €' + value;
          default:
            return '€' + value;
        }
      }
    };
    this.getAllCategories();
  }

  getAllCategories(): void {
    this._categoryService.query().subscribe(data => {
      this.listCategories = data;
      this.selectedValue = 'undefined';
    });
  }

  categorySet(category: string | undefined) {
    this.filters.category = category;

    this._productService.setFilters(this.filters,"category");
    // this.minValue=this._productService.getFilters().priceMin;
    // this.maxValue=this._productService.getFilters().priceMax;
    this.options.floor=this._productService.getProducts().minprice;
    this.options.ceil=this._productService.getProducts().maxprice;
    this.filtersChange.emit(this.filters);
  }



}
