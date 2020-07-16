import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { FavoriteService } from '../services/favorite.service';
import { AuthService } from '../services/auth.service';
import { Comment } from '../shared/comment';
import { visibility, flyInOut, expand } from '../animation/app.animation';

import { Location } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router'
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit, OnDestroy {

  dish: Dish;
  dishcopy: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  errMess: string;
  feedbackComment: Comment;
  visibility;
  subscription: Subscription;
  username: String = undefined;
  favorite: boolean;

  @ViewChild('cform') commentFormDirective;

  //El author fue eliminado de la vista ya que este es obtenido desde el token en el backed

  formErrors = {
    author: '',
    comment: ''
  }

  validationMessages = {
    author: {
      required: 'Author is required.',
      minlength: 'Author must be at least 2 characters long.'
    },
    comment: {
      required: 'comment is required'
    }
  }

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private favoriteService: FavoriteService,
    public auth: AuthService,
    @Inject('BaseURL') public baseURL) { 
      this.createForm();
    }

    /*
    .subscribe(observer) ejecuta el observable y comienza a recibir notificaciones y se le pasa un observer,
    este método retorna un Subscription object que tiene un método unsubscribe el cual se llama para dejar de 
    recibir notificaciones.
    */

  ngOnInit(): void {
    this.auth.loadUserCredentials();

    this.subscription = this.auth.getUsername().subscribe(usn => this.username = usn);
    this.dishService.getDishIds().subscribe(dishIds => {
      this.dishIds = dishIds

      // El switchMap toma el valor emitido por un observable y lo transforma en otro observable y toma solo los valores generados del observable interno más reciente
      this.route.params.pipe(switchMap((params: Params) => {
        this.visibility = 'hidden'; 
        return this.dishService.getDish(params['id']); //Inner observable
        })) 
        .subscribe(dish => { 
          this.dish = dish; 
          this.dishcopy = dish; 
          this.setPrevNext(dish._id);
          this.visibility = 'shown';
          this.favoriteService.isFavorite(this.dish._id)
          .subscribe(resp => { this.favorite = <boolean>resp.exist }, errmess => this.errMess = errmess);
        
      },
      errmess => this.errMess = errmess); // El dish también es un observable  
    },
    errmess => this.errMess = <any>errmess); //params (:id) es un observable
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating: 5,
      comment: ['', Validators.required]
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) return;
    const form = this.commentForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const message = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += message[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    this.feedbackComment = this.commentForm.value;
    this.feedbackComment.date = (new Date()).toISOString();
    console.log(this.feedbackComment);

    /*
    this.dishcopy.comments.push(this.feedbackComment);
    this.dishService.putDish(this.dishcopy).subscribe(dish => { this.dish = dish; this.dishcopy = dish},
      errMess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errMess })
    */

    this.dishService.postDishComment(this.dish, this.feedbackComment)
    .subscribe(dish => this.dish = dish,
      errMess => { this.dish = null; this.errMess = errMess});

    this.commentForm.reset({
      rating: 5,
      comment: ''
    });

    this.commentFormDirective.resetForm({ rating: 5 });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);

    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  addToFavorites() {
    if (!this.favorite) {
      this.favoriteService.postFavorite(this.dish._id)
      .subscribe(favorites => {
        console.log(favorites);
        this.favorite = true;
      });
    } else {
      this.favoriteService.deleteFavorite(this.dish._id)
      .subscribe(favorites => {
        console.log(favorites);
        this.favorite = false;
      })
    }
  }

}
