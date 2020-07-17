import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(public auth: AuthService,
    public router: Router,
    public snackBar: MatSnackBar) { }

    canActivate(): boolean {
      if (!this.auth.isLoggedIn()) {
        this.router.navigate(['home']);
        this.snackBar.open("Only access to logged in users!", "Ok!", { duration: 6000 });
        return false;
      }
      return true;
    }
}
