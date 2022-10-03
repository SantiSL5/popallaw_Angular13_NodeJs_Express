import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/core/models/product';
import { ProductService } from 'src/app/core/services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {

  @Output() upProduct = new EventEmitter<string>();
  listProducts: Product[] = [];
  viewDetails: String = "hidden";
  detailedProduct!: Product;

  constructor(
    private _productService: ProductService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  refreshList(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this._productService.query().subscribe(data => {
      this.listProducts = data;
    });
  }

  deleteProduct(slug: string): void {
    this._productService.destroy(slug).subscribe({
      next: (res) => {
        this.toastrService.success('Product deleted', 'Product deleted');
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  updateProduct(slug: string): void {
    this.upProduct.emit(slug);
  }

  showDetails(slug: string): void {
    this._productService.get(slug).subscribe(data => {
      this.detailedProduct = data;
      this.viewDetails = "show";
    });
  }

}
