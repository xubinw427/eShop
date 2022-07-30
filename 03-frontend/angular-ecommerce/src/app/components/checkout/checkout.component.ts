import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService,
              private cartSrvice: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();



    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl("",
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl("",
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl("", [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl("", [Validators.required, Validators.minLength(2),
                                      Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl("", [Validators.required, Validators.minLength(2),
                                      Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl("", [Validators.required]),
        country: new FormControl("", [Validators.required]),
        zipCode: new FormControl("", [Validators.required, Validators.minLength(2),
                                      Luv2ShopValidators.notOnlyWhiteSpace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl("", [Validators.required, Validators.minLength(2),
                                     Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl("", [Validators.required, Validators.minLength(2),
                                    Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl("", [Validators.required]),
        country: new FormControl("", [Validators.required]),
        zipCode: new FormControl("", [Validators.required, Validators.minLength(2),
                                      Luv2ShopValidators.notOnlyWhiteSpace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl("", [Validators.required]),
        nameOnCard: new FormControl("", [Validators.required, Validators.minLength(2),
                                          Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl("", [Validators.required, Validators.pattern(`[0-9]{16}`)]),
        securityCode: new FormControl("", [Validators.required, Validators.pattern(`[0-9]{3}`)]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate the credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log(`startMonth: ${startMonth}`);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card month: " + JSON.stringify(data));
        this.creditCardMonths = data;

      }
    );


    // populate the credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card year: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );



    // populate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;

      }
    );




  }

  get firstName() { return this.checkoutFormGroup.get("customer.firstName"); }
  get lastName() { return this.checkoutFormGroup.get("customer.lastName"); }
  get email() { return this.checkoutFormGroup.get("customer.email"); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get("shippingAddress.street"); }
  get shippingAddressCity() { return this.checkoutFormGroup.get("shippingAddress.city"); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get("shippingAddress.country"); }
  get shippingAddressState() { return this.checkoutFormGroup.get("shippingAddress.state"); }
  get shippingAddressZipcode() { return this.checkoutFormGroup.get("shippingAddress.zipCode"); }

  get billingAddressStreet() { return this.checkoutFormGroup.get("billingAddress.street"); }
  get billingAddressCity() { return this.checkoutFormGroup.get("billingAddress.city"); }
  get billingAddressCountry() { return this.checkoutFormGroup.get("billingAddress.country"); }
  get billingAddressState() { return this.checkoutFormGroup.get("billingAddress.state"); }
  get billingAddressZipcode() { return this.checkoutFormGroup.get("billingAddress.zipCode"); }


  get creditCardType() { return this.checkoutFormGroup.get("creditCard.cardType")}
  get creditCardNameOnCard() { return this.checkoutFormGroup.get("creditCard.nameOnCard")}
  get creditCardNumber() { return this.checkoutFormGroup.get("creditCard.cardNumber")}
  get creditCardSecurityCode() { return this.checkoutFormGroup.get("creditCard.securityCode")}
  // get creditCardExpirationMonth() { return this.checkoutFormGroup.get("creditCard.expirationMonth")}
  // get creditCardExpirationYear() { return this.checkoutFormGroup.get("creditCard.expirationYear")}




  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // fix for state
      this.billingAddressStates = this.shippingAddressStates;


    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = []
    }
  }


  onSubmit() {

    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }


    // console.log(this.checkoutFormGroup.get('customer').value);
    // console.log("The Email Address is " + this.checkoutFormGroup.get('customer').value.email);
    // console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    // console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    // get cart items
    const cartItems = this.cartSrvice.cartItems;
    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempItem => new OrderItem(tempItem));
    // set up purchase
    let purchase = new Purchase();
    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingAddressState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingAddressState.name;
    purchase.shippingAddress.country = shippingAddressCountry.name;
    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingAddressState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingAddressState.name;
    purchase.billingAddress.country = billingAddressCountry.name;
    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;
    // call REST API via checkoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has beem received.\nOrder Tracking Number: ${response.orderTrackingNumber}`);

          // reset the cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );

  }
  resetCart() {
    // reset cart data
    this.cartSrvice.cartItems = [];
    this.cartSrvice.totalPrice.next(0);
    this.cartSrvice.totalQuantity.next(0);


    // reset form data
    this.checkoutFormGroup.reset();


    // nevigate back to the products page
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;

    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card month: " + JSON.stringify(data));
        this.creditCardMonths = data;

      }
    );
  }
  getStates(formGroupName: string) {

    const fromGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = fromGroup.value.country.code;
    const countryName = fromGroup.value.country.name;

    console.log(`${formGroupName} country code : ${countryCode}`);
    console.log(`${formGroupName} country name : ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default

        fromGroup.get('state').setValue(data[0]);
      }
    );
  }
  reviewCartDetails() {
    // subscribe to the cartService.totalPrice
    this.cartSrvice.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    // subscribe to the cartService.totalQuantity
    this.cartSrvice.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }
}
