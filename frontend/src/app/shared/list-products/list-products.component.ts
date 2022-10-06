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
  isProducts: Boolean = true;

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
      if (data.length == 0) {
        this.isProducts=false;
      }else {
        this.isProducts=true;
        this.listProducts= data;
      }
    });
  }

  showDetails(slug: string): void {
    this._productService.get(slug).subscribe(data => {
      this.detailedProduct = data;
      this.viewDetails = "show";
    });
  }

}
