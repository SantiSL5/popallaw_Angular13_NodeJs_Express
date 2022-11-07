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
    };
    this.setOptions();
    this.getAllCategories();
  }

  getAllCategories(): void {
    this._categoryService.query().subscribe(data => {
      this.listCategories = data;
      this.selectedValue = 'undefined';
    });
  }

  categorySet(category: string | undefined) {
    this.filters=this._productService.getFilters();
    this.filters.category = category;
    this.filters.priceMax=undefined;
    this.filters.priceMin=undefined;
    this.setFilters("category");
  }

  async setFilters(call:string){
    this._productService.setFilters(this.filters,call);
    await setTimeout(()=>{
      this.setOptions();
      this.filtersChange.emit();
    }, 20) ;
  }

  setOptions() {    
    const newOptions: Options = Object.assign({}, this.options);
    let newPriceMax: number =this.maxValue;
    let newPriceMin: number =this.minValue;
    newPriceMin=this._productService.getProducts().minprice;
    newPriceMax=this._productService.getProducts().maxprice;
    newOptions.floor=this._productService.getProducts().minprice;
    newOptions.ceil=this._productService.getProducts().maxprice;
    if (this.options.floor == 0 && this.options.ceil == 0) {
      newOptions.translate= (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return "";
          case LabelType.High:
            return "";
          default:
            return '€' + value;
        }
      }
    }else if (newPriceMin == newPriceMax) {
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
    this.minValue = newPriceMax;
    this.minValue = newPriceMin;
    this.options = newOptions;
  }



}
