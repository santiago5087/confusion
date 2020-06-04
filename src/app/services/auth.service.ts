import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

interface AuthResponse {
  status: string;
  success: string;
  token: string;
}

interface OAuthResponse {
  status: string;
  success: string;
  token: string;
  username: string;
}

interface JWTResponse {
  status: string;
  success: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenKey = 'JWT';
  isAuthenticated: Boolean = false;
  username: Subject<string> = new Subject<string>();
  authToken: string = undefined;

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

    checkJWTtoken() {
      this.http.get<JWTResponse>(baseURL + 'users/checkJWTtoken')
      .subscribe(res => {
        console.log('JWT token valid!: ', res);
        this.sendUsername(res.user.username);
      }, 
      err => {
        console.log('JWT Token invalid: ', err);
        this.destroyUserCredentials();
      });
    }

    sendUsername(name: string) {
      this.username.next(name);
    }

    clearUsername() {
      this.username.next(undefined);
    }

    loadUserCredentials() {
        const credentials = JSON.parse(localStorage.getItem(this.tokenKey));
        console.log('loadUserCredentials: ', credentials);
        if (credentials && credentials.username !== undefined) {
          this.useCredentials(credentials);
          if (this.authToken) {
            this.checkJWTtoken();
          }
        }
    }

    useCredentials(credentials: any) {
      this.isAuthenticated = true;
      this.sendUsername(credentials.username);
      this.authToken = credentials.token;
    }

    destroyUserCredentials() {
      this.authToken = undefined;
      this.isAuthenticated = false;
      this.clearUsername();
      localStorage.removeItem(this.tokenKey);
    }

    logIn(user: any): Observable<any> {
      return this.http.post<AuthResponse>(baseURL + 'users/login', 
      {'username': user.username, 'password': user.password})
      .pipe(map(res => {
        this.storeUserCredentials({"username": user.username, "token": res.token});
        return {'success': true, 'username': user.username}
      }),
      catchError(this.processHTTPMsgService.handleError));
    }

    fbAuth(): Observable<any> {
      window.open(baseURL + 'users/auth/facebook',"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");

      window.addEventListener('message', (message) => {
        this.storeUserCredentials({"username": message.data.username, "token": message.data.token});
        return of({'success': true, 'username': message.data.username});
      });
      
      return of({'success': false, 'username': null});
    }

    storeUserCredentials(credentials: any) {
      localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
      this.useCredentials(credentials);
    }

    logOut() {
      this.destroyUserCredentials();
    }

    isLoggedIn() {
      return this.isAuthenticated;
    }

    getUsername(): Observable<string> {
      return this.username.asObservable();
    }

    getToken() {
      return this.authToken;
    }
}
