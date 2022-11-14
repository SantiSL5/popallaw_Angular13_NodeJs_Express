import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core';
import { Product } from 'src/app/core/models/product';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.component.html',
  styleUrls: ['./details-product.component.css']
})
export class DetailsProductComponent implements OnInit {

  @Output() shShop = new EventEmitter();
  // loaded: Promise<boolean> = Promise.resolve(false);
  product!: Product;

  constructor(
    private _productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private _userService: UserService,
  ) { }

  ngOnInit(): void {
    this.showDetails(this.route.snapshot.paramMap.get("slug") as string);
  }

  showDetails(slug: string) {
    this._productService.get(slug).subscribe(data => {
      console.log(data)
      this.product = data;
    });
  }

  returnShop() {
    this.shShop.emit();
    this.router.navigateByUrl('/shop');
  }

  toggleFav(slug: string, operation: string) {
    this._userService.currentUser.subscribe(
      (loggedUser) => {
        if (loggedUser.username) {
          if (operation == "fav") {
            this.product.favorited = true;
            this.product.favoritesCount++;
            this._productService.favProduct(slug).subscribe();
          } else {
            this.product.favorited = false;
            this.product.favoritesCount--;
            this._productService.unfavProduct(slug).subscribe();
          }
        } else {
          this.router.navigate(['/login']);
        }
      }
    );
  }

}
