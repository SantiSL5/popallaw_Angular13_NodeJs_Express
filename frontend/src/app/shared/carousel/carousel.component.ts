import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private _categoryService: CategoryService,
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
    this.router.navigate(
      ['/shop'],
      { queryParams: { category: btoa(slug) } }
    );
  }

}
