import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/core/models/category';
import { Filters } from 'src/app/core/models/filters';
import { CategoryService } from 'src/app/core/services/category.service';
import { Options, LabelType, CustomStepDefinition } from '@angular-slider/ngx-slider';
import { ProductService } from 'src/app/core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  maxValue = this._productService.getProducts().maxprice;
  minValue = this._productService.getProducts().minprice;
  @Output() filtersChange = new EventEmitter<Filters>();
  listCategories: Category[] = [];
  selectedValue: string = '';
  filters: Filters = {
    category: undefined
  };
  options!: Options;

  constructor(
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.maxValue = this._productService.getProducts().maxprice;
    this.minValue = this._productService.getProducts().minprice;
    this.options = {
      floor: this.minValue,
      ceil: this.maxValue,
    };
    setTimeout(() => {
      this.setOptions();
      this.selectedValue = this._productService.getFilters().category as string;
    }, 80);
  }

  getAllCategories(): void {
    this._categoryService.query().subscribe(data => {
      this.listCategories = data;
      this.selectedValue = 'undefined';
    });
  }

  categorySet(category: string | undefined) {
    this.filters = this._productService.getFilters();
    this.filters.category = category;
    this.filters.priceMax = undefined;
    this.filters.priceMin = undefined;
    this._productService.setFilters(this.filters, "search");
    this.setFilters("category");
  }

  sliderFilterSet() {
    this.filters = this._productService.getFilters();
    this.filters.priceMin = this.minValue;
    this.filters.priceMax = this.maxValue;
    this._productService.setFilters(this.filters, "slider");
    this.setFilters("slider");

  }

  clearFilters() {
    this._productService.setFilters(this.filters, "clear");
    this.setFilters("clear");
  }

  async setFilters(call: string) {
    this._productService.setFilters(this.filters, call);
    if (call == "category") {
      await setTimeout(() => {
        this.setOptions();
        this.filtersChange.emit();
      }, 50);
    } else if (call == "slider") {
      await setTimeout(() => {
        this.filtersChange.emit();
      }, 80);
    } else {
      await setTimeout(() => {
        this.filtersChange.emit();
      }, 80);
    }

  }

  setOptions() {
    const newOptions: Options = Object.assign({}, this.options);
    newOptions.floor = this._productService.getProducts().minprice;
    newOptions.ceil = this._productService.getProducts().maxprice;
    if (newOptions.floor == newOptions.ceil) {
      newOptions.translate = (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return '';
          case LabelType.High:
            return '';
          default:
            return '€' + value;
        }
      }
    } else {
      newOptions.translate = (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return '<b>Min price:</b> €' + value;
          case LabelType.High:
            return '<b>Max price:</b> €' + value;
          default:
            return '€' + value;
        }
      }
    }
    this.minValue = newOptions.floor;
    this.maxValue = newOptions.ceil;
    this.options = newOptions;
  }
}
