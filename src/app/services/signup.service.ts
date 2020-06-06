import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient,
    private processHTTPMeshService: ProcessHTTPMsgService) { }

    submitSignup(data: any): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }

      return this.http.post<any>(baseURL + 'users/signup', data, httpOptions)
        .pipe(catchError(this.processHTTPMeshService.handleError));
    }
}
