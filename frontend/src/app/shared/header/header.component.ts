import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  constructor(
    private _userService: UserService,
    private cd: ChangeDetectorRef,
    private router: Router,
  ) { }

  currentUser!: User;
  url!: any;

  ngOnInit() {
    this._userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
        this.cd.markForCheck();
      }
    );
  }

  logOut() {
    this._userService.purgeAuth();
    window.location.reload();
  }

  goProfile() {
    this.router.navigate(['/profile/' + this.currentUser.username]);
    if (this.router.url.split("/")[1] == "profile") {
      setTimeout(() => {
        window.location.reload();
      }, 50);
    }

  }

}
