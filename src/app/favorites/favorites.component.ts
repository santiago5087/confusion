import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { Favorite } from '../shared/favorite';
import { FavoriteService } from '../services/favorite.service';
import { flyInOut, expand } from '../animation/app.animation';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class FavoritesComponent implements OnInit {

  favorites: Favorite;
  delete: boolean;
  errMess: string;

  constructor(private favoriteService: FavoriteService,
    @Inject('BaseURL') public baseURL) { }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
    .subscribe(favorites => this.favorites = favorites,
      errMess => this.errMess = errMess);
  }

  deleteFavorite(id: string) { //Arreglar lo del botón del corazón
    this.favoriteService.deleteFavorite(id)
    .subscribe(favorites => this.favorites = <Favorite>favorites,
      errMess => this.errMess = errMess);
    this.delete = false;
  }

}
