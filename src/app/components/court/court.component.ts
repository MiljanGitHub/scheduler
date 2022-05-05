import { Component, Inject, OnInit } from '@angular/core';
import { Builder } from 'builder-pattern';
import { Timeslot } from 'src/app/model/timeslot';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StripeService } from 'ngx-stripe';
import {StripeElementsOptions,PaymentRequestPaymentMethodEvent,PaymentIntent,PaymentRequestShippingAddressEvent} from '@stripe/stripe-js';
import { DOCUMENT } from '@angular/common';
import {loadStripe} from '@stripe/stripe-js';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  StripePaymentElementComponent } from 'ngx-stripe';


@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.css']
})
export class CourtComponent implements OnInit {

  //stripe elements
  @ViewChild(StripePaymentElementComponent)
  public paymentElement: StripePaymentElementComponent;
  public stripeForm : FormGroup;
  public paymentTypeForm: FormGroup;
  public elementsOptions: StripeElementsOptions = {locale: 'en'};
 
  //user's data
  public loggedInUser = "Pera Peric";
  public loggedInUserEmail = "pera@gmail.com";

  //dummy amount for pricing for single Reservation; every other Reservation added is incremented by 10;
  public amount = 0;

  //helper variables
  public paymentType: string;
  public startDate: Date;
  public endDate: Date;
  public paymentIntentExists: boolean;

  //timeslots repository
  public timeslots: Timeslot[] = []; //[Builder(Timeslot).start("1650914076517").end("1650914076517").build()];

  constructor(private fb: FormBuilder, @Inject(DOCUMENT) private document: Document, private http: HttpClient, private stripeService: StripeService) { 


  }

  ngOnInit(): void {
    //init Stripe
    loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

    //initialize paymentTypeForm [cash or card]
    this.paymentTypeForm = this.fb.group({
      'type': 1
    });
    
    //default payment type
    this.paymentType = 'cash';

    //initialize form for user's data
    this.stripeForm = this.fb.group({
      name: [this.loggedInUser, [Validators.required, Validators.minLength(3)]],
      amount: new FormControl({value: this.amount, disabled: true}, [Validators.required, Validators.min(5)]),
      email: [this.loggedInUserEmail, [Validators.email, Validators.required]],
    });
   
    
  }

  changePaymentTypeToCash(){
    this.paymentType = 'cash';
  }

  changePaymentTypeToCard(){
    this.paymentType = 'card';
  }

  private createPaymentIntent(amount: number): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8080/create-payment-intent`,
      { amount : amount }
    );
  }

  public removeTimeslote(index : number){
    this.resetPaymentIntent()
    if (this.timeslots.length == 0) return;
    this.timeslots.splice(index, 1);
    //this.stripeForm.controls['amount'].value
    //this.stripeForm.controls['amount'].setValue(5)
    if (this.timeslots.length == 1) this.stripeForm.controls['amount'].setValue(5)
    //this.amount = 5
    else if (this.timeslots.length > 1) this.stripeForm.controls['amount'].setValue(this.stripeForm.controls['amount'].value - 10)
    //this.amount = this.amount - 10;
    else if (this.timeslots.length == 0) this.stripeForm.controls['amount'].setValue(0)
    //this.amount = 0;
  }

  public addTimeslot(){
    if (this.startDate == null || this.startDate== undefined || this.endDate == null || this.endDate == undefined){
      alert("Start and end date must be valid for a given timeslot!");
      return;
    }  
    this.resetPaymentIntent()

    this.timeslots.push(Builder(Timeslot).start(this.startDate.getTime().toString()).end(this.endDate.getTime().toString()).build())
    if (this.timeslots.length == 1) this.stripeForm.controls['amount'].setValue(5);
    else if (this.timeslots.length > 1) this.stripeForm.controls['amount'].setValue(this.stripeForm.controls['amount'].value + 10);

  }
  
  public resetPaymentIntent(){
    this.elementsOptions =  {locale: 'en'};
    this.paymentIntentExists = false;
  }

  public fetchPaymentIntent(){
    //create payment intent if there is at least single reservation..

    //console.log(this.stripeForm.get('amount')!.value)
    this.createPaymentIntent(this.stripeForm.get('amount')!.value)
    .subscribe(clientSecretResponse => {
      console.log("payment intent: " + clientSecretResponse.clientSecret)
      this.elementsOptions.clientSecret = clientSecretResponse.clientSecret;
      this.paymentIntentExists = true;
    });
  }

  public payByCash(){
    console.log("paying by cash...")
  }

  public dateChangedStart(eventDate: string): Date | null {
    this.startDate = new Date(eventDate.toString())
    return !!eventDate ? new Date(eventDate) : null;
  }

  public dateChangedEnd(eventDate: string): Date | null {
    this.endDate = new Date(eventDate.toString())
    return !!eventDate ? new Date(eventDate) : null;
  }

  public pay(){
    if (this.stripeForm.valid) {
      this.stripeService.confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: this.stripeForm.get('name')!.value,
              email: this.stripeForm.get('email')!.value
            }
          }
        },
        redirect: 'if_required'
      }).subscribe(result => {
        console.log('Result', result);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.paymentIntent!.status === 'succeeded') {
            // Show a success message to your customer
            alert({ success: true });
          }
        }
      });
    } else {
      console.log(this.stripeForm);
    }
  }

  

}
