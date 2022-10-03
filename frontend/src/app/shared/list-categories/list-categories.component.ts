import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/core/models/category';
import { CategoryService } from 'src/app/core/services/category.service';
import { Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css']
})

export class ListCategoriesComponent implements OnInit {

  @Output() upCategory = new EventEmitter<string>();
  listCategories: Category[] = [];
  viewDetails: String = "hidden";
  detailedCategory!: Category;

  constructor(
    private _categoryService: CategoryService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  refreshList(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this._categoryService.query().subscribe(data => {
      this.listCategories = data;
    });
  }

  deleteCategory(slug: string): void {
    this._categoryService.destroy(slug).subscribe({
      next: (res) => {
        this.toastrService.success('Category deleted', 'Category deleted');
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  updateCategory(slug: string): void {
    this.upCategory.emit(slug);
  }

  showDetails(slug: string): void {
    this._categoryService.get(slug).subscribe(data => {
      this.detailedCategory = data;
      this.viewDetails = "show";
    });
  }

}



