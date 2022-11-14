import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Profile, ProfileService, UserService } from '../core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  settingsForm: FormGroup;
  confirmPassword_invalid = true;
  update: { bio?: string, password?: string } = {};
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _userService: UserService,
    private _profileService: ProfileService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
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
  loaded: Promise<boolean> = Promise.resolve(false);
  profile!: Profile;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.user = params['username'];
    });
    this._userService.currentUser.subscribe(
      (userData) => {
        this.view = "list";
        this.owner = this.route.snapshot.paramMap.get("username") == userData.username;
        this._profileService.get(this.user).subscribe(profile => {

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

  toggleFollow(following: Boolean) {
    if (!following) {
      this._profileService.follow(this.profile.username).subscribe();
      this.profile.following = true;
    } else {
      this._profileService.unfollow(this.profile.username).subscribe();
      this.profile.following = false;
    }
  }

}
