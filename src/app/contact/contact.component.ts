import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { } from 'googlemaps';

import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand } from '../animation/app.animation';
import { FeedbackService } from '../services/feedback.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block'
  },
  animations: [
    flyInOut(),
    expand() 
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  errMess: string;
  formSent: boolean;
  showPreview: boolean;
  showForm = true;
  @ViewChild('fform') feedbackFormDirective;
  @ViewChild('map', { static: true }) mapElement;
  map: google.maps.Map;

  formErrors = {
    'firstName': '',
    'lastName': '',
    'telNum': '',
    'email': ''
  }

  validationMessages = {
    'firstName': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastName': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telNum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  constructor(private fb: FormBuilder,
    private feedbackService: FeedbackService) { 
    this.createForm();
  }

  ngOnInit(): void {
    const mapProperties = {
      center: new google.maps.LatLng(6.2614659, -75.5793956),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telNum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contactType: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }
  
  onValueChanged(data?: any) {
    if (!this.feedbackForm) return;
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // Clear previous error message (if any)
         this.formErrors[field] = '';
         const control = form.get(field);
         if (control && control.dirty && !control.valid) {
           const messages = this.validationMessages[field];
           for (const key in control.errors) {
             if (control.errors.hasOwnProperty(key)) {
               this.formErrors[field] += messages[key] + ' ';
             }
           }
         }
      }
    }  
  }

  onSubmit() {
    this.showForm = false;
    this.formSent = true;
    this.feedbackService.submitFeedback(this.feedbackForm.value)
      .subscribe(feedback => { 
        this.feedback = feedback; 
        this.formSent = false
        this.showPreview = true;
        setTimeout(() => {
          this.showPreview = false;
          this.showForm = true;
        }, 5000); 
      },
        errMess => { 
          this.feedback = null;
          this.formSent = false; 
          this.errMess = errMess;
        });

    this.feedbackForm.reset({
      firstName: '',
      lastName: '',
      telNum: '',
      email: '',
      agree: false,
      contactType: 'None',
      message: ''
    });

    this.feedbackFormDirective.resetForm({ agree: false, contactType: 'None' });
  }

}
