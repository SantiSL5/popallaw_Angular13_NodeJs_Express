import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Product } from 'src/app/core/models/product';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.component.html',
  styleUrls: ['./details-product.component.css']
})
export class DetailsProductComponent implements OnInit {

  @Input() slug = '';
  product!: Product;

  constructor(
    private _productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.showDetails(this.slug);
  }

  showDetails(slug: string) {
    this._productService.get(slug).subscribe(data => {
      this.product = data;
    });
  }
}
