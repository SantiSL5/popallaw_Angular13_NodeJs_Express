import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  view: String = "list";
  slug: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  showDetails(slug: string) {
    this.slug = slug;
    this.view = "details";
  }

}
