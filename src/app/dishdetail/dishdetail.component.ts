import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

import { Location } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router'
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishcopy: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  errMess: string;
  feedbackComment: Comment;

  @ViewChild('cform') commentFormDirective;

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
    @Inject('BaseURL') public baseURL) { 
      this.createForm();
    }

  ngOnInit(): void {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
      errmess => this.errMess = <any>errmess); //params (:id) es un observable
    // El switchMap para de emitir valores del observable interno si un nuevo observable comienza a emitir
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id']))) //Inner observable
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id) },
      errmess => this.errMess = errmess); // El dish también es un observable
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
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

    this.dishcopy.comments.push(this.feedbackComment);
    this.dishService.putDish(this.dishcopy).subscribe(dish => { this.dish = dish; this.dishcopy = dish},
      errMess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errMess })

    this.commentForm.reset({
      author: '',
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

}
