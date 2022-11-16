import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService, PaginationConfig, Profile, ProfileService, UserService } from 'src/app/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isFollowers: Boolean = true;
  isFollowings: Boolean = true;
  isLikes: Boolean = true;
  isComments: Boolean = true;
  settingsForm: FormGroup;
  confirmPassword_invalid = true;
  listConfig!: PaginationConfig;
  update: { bio?: string, password?: string } = {};
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _userService: UserService,
    private _profileService: ProfileService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private _productService: ProductService
  ) {
    this.settingsForm = this.fb.group({
      bio: [undefined, [Validators.required]],
      password: [undefined, [Validators.minLength(5)]],
      repeatPassword: [undefined, [Validators.minLength(5)]],
    }, {
      validator: (formGroup: FormGroup) => {
        const control = formGroup.controls['password'];
        const matchingControl = formGroup.controls['repeatPassword'];
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ repeatPassword: true });
          this.confirmPassword_invalid = true;
        } else {
          matchingControl.setErrors(null);
          this.confirmPassword_invalid = false;
        }
        if (matchingControl.errors && !matchingControl.errors['repeatPassword']) {
          return;
        }
      }
    });
  }
  view: string = "list";
  user!: string;
  owner: boolean = false;
  currentUser!: String;
  loggedUser: string = "";
  loaded: Promise<boolean> = Promise.resolve(false);
  profile!: Profile;
  followers!: any;
  followings!: any;
  likes!: any;
  comments!: any;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.user = params['username'];
    });
    this._userService.currentUser.subscribe(
      (userData) => {
        this.view = "list";
        this.currentUser = userData.username;
        this.owner = this.route.snapshot.paramMap.get("username") == userData.username;
        this._profileService.get(this.user).subscribe(profile => {
          this.loggedUser = userData.username;
          if (profile == "notFound") {
            this.router.navigateByUrl('/');
          } else {
            this.profile = profile;
            this.loaded = Promise.resolve(true);
          }
        });
        this.cd.markForCheck();
      }
    );
  }

  viewSettings() {
    this.view = "settings";
    this.settingsForm.patchValue({
      bio: this.profile.bio,
    });
  }

  submitForm() {
    this.update = {};
    if (this.settingsForm.value.bio != null) {
      this.update.bio = this.settingsForm.value.bio;
      if (this.update.bio != this.profile.bio) {
        this.toastr.success('Bio changed');
      }
    }
    if (this.settingsForm.value.password != null) {
      this.update.password = this.settingsForm.value.password;
      this.toastr.success('Password changed');
    }
    this._userService.updateUser(JSON.stringify(this.update)).subscribe(newValue => {
      this.profile = newValue;
      this.settingsForm.controls['password'].setValue(null);
      this.settingsForm.controls['repeatPassword'].setValue(null);
    });
  }

  toggleFollow(following: Boolean, username: string = "", i: number = 0, from: string = "") {
    if (typeof following == 'string') {
      if (following == 'true') {
        following = true;
      } else {
        following = false;
      }
    }
    if (this.loggedUser) {

      if (username) {
        if (!following) {
          this._profileService.follow(username).subscribe();
          if (from == "followers") {
            this.followers[i].isFollowed = true;
          } else {
            this.followings[i].salt = "true";
          }
          if (this.owner) {
            this.profile.numFollowing++;
          }
        } else {
          this._profileService.unfollow(username).subscribe();
          if (from == "followers") {
            this.followers[i].isFollowed = false;
          } else {
            this.followings[i].salt = "false";
          }
          if (this.owner) {
            this.profile.numFollowing--;
          }
        }

      } else {
        if (!following) {
          this._profileService.follow(this.profile.username).subscribe();
          this.profile.following = true;
          this.profile.numFollowers++;
        } else {
          this._profileService.unfollow(this.profile.username).subscribe();
          this.profile.following = false;
          this.profile.numFollowers--;
        }
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  changeView(toShow: string) {
    this.view = toShow;
    switch (toShow) {
      case "followers":
        this.followers = this._profileService.getFollowers(this.profile.username, 0, 2).subscribe(value => {
          if (value.numItems == 0) {
            this.isFollowers = false;
          } else {
            this.isFollowers = true;
            this.followers = value.followers;
            this.listConfig = {
              numItems: value.numItems,
              limit: 2,
              page: "profile"
            }
          }
        });
        break;
      case "following":
        this.followings = this._profileService.getFollowings(this.profile.username, 0, 2).subscribe(value => {
          if (value.numItems == 0) {
            this.isFollowings = false;
          } else {
            this.isFollowings = true;
            this.followings = value.followings;
            this.listConfig = {
              numItems: value.numItems,
              limit: 2,
              page: "profile"
            }
          }
        });
        break;
      case "likes":
        this.likes = this._profileService.getLikes(this.profile.username, 0, 2).subscribe(value => {
          if (value.numItems == 0) {
            this.isLikes = false;
          } else {
            this.isLikes = true;
            this.likes = value.likes;
            this.listConfig = {
              numItems: value.numItems,
              limit: 2,
              page: "profile"
            }
          }
        });
        break;
      case "comments":
        this.comments = this._profileService.getComments(this.profile.username, 0, 2).subscribe(value => {
          if (value.numItems == 0) {
            this.isComments = false;
          } else {
            this.isComments = true;
            this.comments = value.comments;
            this.listConfig = {
              numItems: value.numItems,
              limit: 2,
              page: "profile"
            }
          }
        });
        break;
      default:
        break;
    }
  }

  loadPage(page: number) {
    switch (this.view) {
      case "followers":
        this.followers = this._profileService.getFollowers(this.profile.username, (page - 1) * 2, 2).subscribe(value => {
          this.followers = value.followers;
        });
        break;
      case "following":
        this.followings = this._profileService.getFollowings(this.profile.username, (page - 1) * 2, 2).subscribe(value => {
          this.followings = value.followings;
        });
        break;
      case "likes":
        this.likes = this._profileService.getLikes(this.profile.username, (page - 1) * 2, 2).subscribe(value => {
          this.likes = value.likes;
        });
        break;
      case "comments":
        this.comments = this._profileService.getComments(this.profile.username, (page - 1) * 2, 2).subscribe(value => {
          this.comments = value.comments;
        });
        break;
      default:
        break;
    }
  }

  goShop(product: string) {
    this.router.navigate(['/shop/item/' + product]);
  }

  toggleFav(slug: string, operation: string, i: number) {
    this._userService.currentUser.subscribe(
      (loggedUser) => {
        if (loggedUser.username) {
          if (operation == "fav") {
            this.likes[i].favorited = true;
            this.likes[i].favoritesCount++;
            if (this.owner) {
              this.profile.numLikes++;
            }
            this._productService.favProduct(slug).subscribe();
          } else {
            this.likes[i].favorited = false;
            this.likes[i].favoritesCount--;
            if (this.owner) {
              this.profile.numLikes--;
            }
            this._productService.unfavProduct(slug).subscribe();
          }
        } else {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  goProfile(username: string) {
    this.router.navigate(['/profile/' + username]);
    setTimeout(() => {
      window.location.reload();
    }, 50);
  }

}
