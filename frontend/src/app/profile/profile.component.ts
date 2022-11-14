import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile, ProfileService, UserService } from '../core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _userService: UserService,
    private _profileService: ProfileService,
    private cd: ChangeDetectorRef
  ) { }
  user!:string;
  owner:boolean = false;
  loaded: Promise<boolean>=Promise.resolve(false);
  profile!: Profile;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.user=params['username'];
    });
    this._userService.currentUser.subscribe(
      (userData) => {
        this.owner= this.route.snapshot.paramMap.get("username") == userData.username;
        this._profileService.get(this.user).subscribe(profile=>{
          if (profile=="notFound") {
            this.router.navigateByUrl('/');
          }else {
            console.log(profile.profile)
            this.profile=profile;
            this.loaded=Promise.resolve(true);
          }
        });
        this.cd.markForCheck();
      }
    );
  }

}
