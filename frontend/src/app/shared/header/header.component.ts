import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    private cd: ChangeDetectorRef
  ) {}

  currentUser!: User;

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
  }

}
