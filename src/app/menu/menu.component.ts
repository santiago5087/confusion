import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { flyInOut, expand } from '../animation/app.animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block'
  },
  animations: [
    flyInOut(),
    expand() 
  ]
})

export class MenuComponent implements OnInit {
  
  dishes: Dish[];
  errMess: string;

  constructor(private dishService: DishService, 
    @Inject('BaseURL') public baseURL) { } //De esta forma se inyecta el servicio
  
  ngOnInit(): void {
    this.dishService.getDishes()
      .subscribe(dishes => this.dishes = dishes,
        errmes => this.errMess = <any>errmes);
  }
}