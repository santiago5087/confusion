import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Favorite } from '../shared/favorite';
import { Dish } from '../shared/dish';
import { FavoriteExists } from '../shared/favoriteExists';

import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient,
    public auth: AuthService,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

    getFavorites(): Observable<Favorite> {
      if (!this.auth.isLoggedIn()) {
        return null
      }
      return this.http.get<Favorite>(baseURL + 'favorites')
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }
    
    postFavorites(dishes: Dish[]): Observable<Favorite> {
      return this.http.post<Favorite>(baseURL + 'favorites', dishes)
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }

    isFavorite(id: string): Observable<FavoriteExists> {
      if (!this.auth.isLoggedIn()) {
        return of({ exists: false, favorites: null});
      } 
      
      return this.http.get<FavoriteExists>(baseURL + 'favorites/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }

    postFavorite(id: string) {
      return this.http.post(baseURL + 'favorites/' + id, id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }

    deleteFavorite(id: string) {
      return this.http.delete(baseURL + 'favorites/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }
}
