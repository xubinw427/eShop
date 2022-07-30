import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;

  // storage: Storage sessionStorage;


  constructor() {
    // read the data from storage
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if(data != null){
      this.cartItems = data;
      this.computeCartTotals();
    }
   }

  addToCart(theCartItem: CartItem){

    // check if we already have the item in our cart
    let alreadyExistInCart: boolean = false;
    let existingItem: CartItem = undefined!;

    if(this.cartItems.length > 0){
      // find the item based on the item id
      // for(let tempCartItem of this.cartItems){
      //   if(theCartItem.id == tempCartItem.id){
      //     existingItem = tempCartItem;
      //     break;
      //   }
      // }
      existingItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)
      // check if we found it
      alreadyExistInCart = (existingItem != undefined);
    }

    if(alreadyExistInCart){
      // console.log("adding same Item");
      
      existingItem.quantity++;
      // console.log(`${existingItem.name} has ${existingItem.quantity}`);
      
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id);
    // if found, remove the item from thee array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);


      this.computeCartTotals();
    }

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for(let currntCartItem of this.cartItems){
      totalPriceValue += currntCartItem.quantity * currntCartItem.unitPrice;
      totalQuantityValue += currntCartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purpose
    this.logCartData(totalPriceValue, totalQuantityValue);
    this.persistCartItems();
    
  }


  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }


  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);
    for(let tempCartItem of this.cartItems){
      const subTotalPrice: number = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name:${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue.toFixed(2)}`);
    console.log("--------");
  }
}
