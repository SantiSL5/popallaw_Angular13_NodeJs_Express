import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../core/services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  form: String = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;
  confirmPassword_invalid= true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      repeatPassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
    },{ 
      validator: (formGroup: FormGroup) => {
        const control = formGroup.controls['password'];
        const matchingControl = formGroup.controls['repeatPassword'];
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ repeatPassword: true });
          this.confirmPassword_invalid=true;
      } else {
          matchingControl.setErrors(null);
          this.confirmPassword_invalid=false;
      }
        if (matchingControl.errors && !matchingControl.errors['repeatPassword']) {
            return;
        }
    }
    });
  }

  ngOnInit(): void {
  }

  submitForm() {
    if (this.form == "login") {
      this.serviceRequest(this.loginForm.value);
    } else {
      
      this.serviceRequest(this.registerForm.value);
    }
  }

  serviceRequest(credentials: object) {
    this.userService.attemptAuth(this.form, credentials).subscribe(data => {
    }, (error: any) => {
      if (error) {
        if (error.error.errors.username) {
          this.toastr.error(error.error.errors.username, 'Register');
        }
        if (error.error.errors.email) {
          this.toastr.error(error.error.errors.email, 'Register');
        }
      }
    })
  }

}
