import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { FacebookLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {username: '', password: '', remember: false};

  constructor(public dialogRef: MatDialogRef<LoginComponent>,
    private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log('User: ', this.user);
    this.authService.logIn(this.user)
      .subscribe(res => {
        if (res.success) {
          this.dialogRef.close();
        } else {
          console.log(res);
        }
      },
      error => {
        console.log(error);
        //this.errMess = error;
      });
  }

  facebookAuth() {
    this.authService.fbAuth()
      .subscribe(res => {
        if (res.success) {
        } else {
          console.log(res);
        }
        this.dialogRef.close();
      },
      error => {
        console.log(error);
      });
  }

  googleAuth() {

  }

}
