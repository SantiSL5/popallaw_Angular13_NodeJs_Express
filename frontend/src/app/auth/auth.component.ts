import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  form: String = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(5)]],
    });

  }

  ngOnInit(): void {
  }

  submitForm() {
    if (this.form == "login") {
      const credentials = this.loginForm.value;
      console.log(credentials);
    } else {
      const credentials = this.registerForm.value;
      console.log(credentials);

    }
  }

}
