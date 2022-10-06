import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/core/models/category';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.css']
})
export class InfiniteScrollComponent implements OnInit {

  listCategories: Category[] = [];
  limit: number = 2;
  offset: number = 0;

  constructor(private _categoryService: CategoryService) { }

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

}