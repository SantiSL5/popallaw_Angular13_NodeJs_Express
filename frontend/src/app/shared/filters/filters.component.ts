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
    this.getAllCategories();
    this.filters=this._productService.getFilters();
    if (this.filters.priceMax==undefined) {
      this.maxValue=this._productService.getProducts().maxprice;
    }else {
      this.maxValue=this.filters.priceMax;
    }
    if (this.filters.priceMin==undefined) {
      this.maxValue=this._productService.getProducts().minprice;
    }else {
      this.minValue=this.filters.priceMin;
    }
    this.options= {
      floor: this.minValue,
      ceil: this.maxValue,
    };
    this.setOptions();

    setTimeout(()=>{
      if (this.filters.category!=undefined) {
        this.selectedValue=this.filters.category;
      }
    }, 60);
  }

  getAllCategories(): void {
    this._categoryService.query().subscribe(data => {
      this.listCategories = data;
      this.selectedValue = 'undefined';
    });
  }

  categorySet(category: string | undefined) {
    this.filters.offset=0;
    this.filters=this._productService.getFilters();
    this.filters.category = category;
    this.filters.priceMax=undefined;
    this.filters.priceMin=undefined;
    this.setFilters("category");
  }

  sliderFilterSet() {
    this.filters.offset=0;
    this.filters=this._productService.getFilters();
    this.filters.priceMin=this.minValue;
    this.filters.priceMax=this.maxValue;
    this.setFilters("slider");
  }

  async setFilters(call:string){
    this._productService.setFilters(this.filters,call);
    if (call=="category") {
      await setTimeout(()=>{
        this.setOptions();
        this.filtersChange.emit();
      }, 50);
    }else if (call=="slider") {
      await setTimeout(()=>{
        this.filtersChange.emit();
      }, 80);
    }else {
      await setTimeout(()=>{
        this.filtersChange.emit();
      }, 50);
    }

  }

  clearFilters() {
    this._productService.setFilters(this.filters, "clear");
    this.setFilters("clear");
    setTimeout(()=>{
      this.maxValue=this._productService.getProducts().maxprice;
      this.maxValue=this._productService.getProducts().minprice;
      this.options= {
        floor: this.minValue,
        ceil: this.maxValue,
      };
      this.setOptions();
    }, 50);
  }

  setOptions() {    
    const newOptions: Options = Object.assign({}, this.options);
    newOptions.floor=this._productService.getProducts().minprice;
    newOptions.ceil=this._productService.getProducts().maxprice;
    if (newOptions.floor == newOptions.ceil) {
      newOptions.translate= (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return '';
          case LabelType.High:
            return '';
          default:
            return '€' + value;
        }
      }
    }else  {
      newOptions.translate= (value: number, label: LabelType): string => {
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