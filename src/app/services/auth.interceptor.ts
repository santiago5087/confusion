import { Injectable, Injector} from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    var authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + authToken)});
    //authReq = authReq.clone({headers: req.headers.set('Content-Type', 'application/json')}); 
    
    return next.handle(authReq);
  }
}

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();

    return next.handle(req)
      .pipe(tap((event: HttpEvent<any>) => {
        //do nothing
      }, (err: any) => {
        if (err.status === 401 && authToken) {
          console.log('Unauthorized Interceptor: ', err);
          this.authService.checkJWTtoken();
        }
      }));
  }
}