import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../services/auth.service';
import { SignupService } from '../services/signup.service';

const comparePwdsValidator: ValidatorFn = (control: FormGroup):
  ValidationErrors | null => {
    const password = control.get('password');
    const passwordVerify = control.get('passwordVer');

    return password && passwordVerify && password.value !== passwordVerify.value ? {'comparePwds': true}: null; 
  }

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  errMess: String;
  @ViewChild('form') signupFormDirective;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private signupService: SignupService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      firstname: [''],
      lastname: [''],
      password: ['', Validators.required],
      passwordVer: ['', Validators.required]
    }, { validators: comparePwdsValidator });
  }

  onSubmit() {
    this.signupService.submitSignup(this.signupForm.value)
      .subscribe(signup => {
        console.log('Successfully registration');
        this.signupForm.reset({
          username: '',
          firstname: '',
          lastname: '',
          password: '',
          passwordVer: ''
        });
  
        this.signupFormDirective.resetForm();
        this.snackBar.open(signup.status, "close", { duration: 10000 });
      },
      errMess => {
        this.snackBar.open(errMess, "close", { duration: 10000 });
        this.errMess = errMess;
      });
  }

  facebookAuth() {
    this.authService.fbAuth()
      .subscribe(res => {
        if (res.success) {
          this.router.navigate(['/home']);
        } else {
          console.log(res);
        }
      },
      error => {
        console.log(error);
      });
  }

  googleAuth() {
    this.authService.gooAuth()
      .subscribe(res => {
        if (res.success) {
          this.router.navigate(['/home']);
        } else {
          console.log(res);
        }
      },
      error => {
        console.log(error);
      });
  }

}
