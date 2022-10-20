import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  search: String = '';

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  public autoComplete(data: any): void {


  }

  public enterEvent(data: any): void {
    if (typeof data.search === 'string') {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/shop'], { queryParams: { search: this.search } });
      });
    }
  }

}
