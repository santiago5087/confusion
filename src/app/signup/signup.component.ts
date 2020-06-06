import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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
  @ViewChild('form') signupFormDirective;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

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

  }

  facebookAuth() {
    this.authService.fbAuth()
      .subscribe(res => {
        if (res.success) {
        } else {
          console.log(res);
        }
        this.router.navigate(['/home']);
      },
      error => {
        console.log(error);
      });
  }

  googleAuth() {
    this.authService.gooAuth()
      .subscribe(res => {
        if (res.success) {
        } else {
          console.log(res);
        }
        this.router.navigate(['/home']);
      },
      error => {
        console.log(error);
      });
  }

}
