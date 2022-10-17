import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/core/models/category';
import { Filters } from 'src/app/core/models/filters';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<Filters>();
  listCategories: Category[] = [];
  selectedValue: string = '';
  filters: Filters = {
    category: undefined
  };

  constructor(private _categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this._categoryService.query().subscribe(data => {
      this.listCategories = data;
      this.selectedValue = 'undefined';
    });
  }

  categorySet(category: string | undefined) {
    console.log(category);
    this.filters.category = category;
    this.filtersChange.emit(this.filters);
  }

}
