import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import axios from 'axios';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  userId: number | null;
  product: any;
}

interface Order {
  id: number;
  userId: number | null;
  productId: number;
  quantity: number;
  status: string;
  orderDate: string;
  address: string;
  strictDetails: string;
  taxCode: string;
  city: string;
  phoneNumber: string;
  addressForBilling: string;
  strictDetailsForBilling: string;
  taxCodeForBilling: string;
  cityForBilling: string;
  phoneNumberForBilling: string;
  name: string;
  surname: string;
  eMail: string | null;
  orderNo: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSource = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSource.asObservable();
  private isBrowser: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  updateCartItems(cartItems: CartItem[]) {
    this.cartItemsSource.next(cartItems);
  }

  async checkCartItem(productId: number, userId: number): Promise<any> {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`https://sellingthingsapi.shop/api/Cart/GetForUpdatedAsync`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params: { productId, userId }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async fetchCartItems() {
    const token = localStorage.getItem('authToken');
    const user = this.userService.getUserDetails();
    if (!user) {
      const localCartItems = this.getCartItemsFromLocalStorage();
      this.updateCartItems(localCartItems);
      return localCartItems;
    }
    try {
      const response = await axios.get('https://sellingthingsapi.shop/api/Cart/GetByUserIdAsync', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params: { userId: Number(user?.id) }
      });
      const fetchedItems = response.data || [];
      this.updateCartItems(fetchedItems);
      return fetchedItems;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async addToCart(product: any, quantity: number) {
    const token = localStorage.getItem('authToken');
    const user = this.userService.getUserDetails();
    if (user) {
      const existingCartItem = await this.checkCartItem(product.id, Number(user?.id));
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        const payload = {
          id: existingCartItem.id,
          userId: Number(user?.id),
          productId: product.id,
          quantity: existingCartItem.quantity
        };
        try {
          const response = await axios.put('https://sellingthingsapi.shop/api/Cart/UpdateAsync', payload, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          this.fetchCartItems();
          return response.data;
        } catch (error) {
          throw error;
        }
      } else {
        const payload = {
          id: 0,
          userId: Number(user?.id),
          productId: product.id,
          quantity: quantity
        };
        try {
          const response = await axios.post('https://sellingthingsapi.shop/api/Cart/InsertAsync', payload, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          this.fetchCartItems();
          return response.data;
        } catch (error) {
          throw error;
        }
      }
    } else {
      const cartItems = this.getCartItemsFromLocalStorage();
      const existingCartItem = cartItems.find(item => item.productId === product.id);
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        const cartItem: CartItem = {
          id: 0,
          productId: product.id,
          quantity: quantity,
          userId: null,
          product: { ...product }
        };
        cartItems.push(cartItem);
      }
      this.setCartItemsToLocalStorage(cartItems);
      this.updateCartItems(cartItems);
    }
  }

  async removeFromCart(id: number, index: number) {
    const token = localStorage.getItem('authToken');
    const updatedCartItems = this.cartItemsSource.getValue();
    const user = this.userService.getUserDetails();
    if (user) {
      try {
        await axios.delete('https://sellingthingsapi.shop/api/Cart/DeleteAsync', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          params: { id }
        });
        updatedCartItems.splice(index, 1);
        this.updateCartItems(updatedCartItems);
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    } else {
      updatedCartItems.splice(index, 1);
      this.setCartItemsToLocalStorage(updatedCartItems);
      this.updateCartItems(updatedCartItems);
    }
  }

  async createOrderFromCart(
    userEmail: string,
    firstName: string,
    lastName: string,
    address: string,
    streetDetails: string,
    postalCode: string,
    city: string,
    phone: string,
    billingAddress: string,
    billingStreetDetails: string,
    billingPostalCode: string,
    billingCity: string,
    billingPhone: string,
    sameAsShipping: boolean
  ) {
    const token = localStorage.getItem('authToken');
    const cartItems = this.getCartItems();
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    } else {
      const orderNo = this.generateRandomOrderNumber();
      const user = this.userService.getUserDetails();
      for (const item of cartItems) {
        const newOrder: Order = {
          id: 0,
          userId: user ? Number(user.id) : null,
          productId: item.productId,
          quantity: item.quantity,
          status: "Pending",
          orderDate: new Date().toISOString(),
          address: address,
          strictDetails: streetDetails,
          taxCode: postalCode,
          city: city,
          phoneNumber: phone,
          addressForBilling: sameAsShipping ? address : billingAddress,
          strictDetailsForBilling: sameAsShipping ? streetDetails : billingStreetDetails,
          taxCodeForBilling: sameAsShipping ? postalCode : billingPostalCode,
          cityForBilling: sameAsShipping ? city : billingCity,
          phoneNumberForBilling: sameAsShipping ? phone : billingPhone,
          name: firstName,
          surname: lastName,
          eMail: user?.email || userEmail,
          orderNo: orderNo
        };
        try {
          await axios.post('https://sellingthingsapi.shop/api/Order/InsertAsync', newOrder, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          return orderNo;
        } catch (error) {
          console.error('API Error:', error);
          throw error;
        }
      }
    }
    return 0;
  }

  private getCartItemsFromLocalStorage(): CartItem[] {
    if (this.isBrowser) {
      const cartItems = localStorage.getItem('localCartItems');
      return cartItems ? JSON.parse(cartItems) : [];
    }
    return [];
  }

  private setCartItemsToLocalStorage(cartItems: CartItem[]) {
    if (this.isBrowser) {
      localStorage.setItem('localCartItems', JSON.stringify(cartItems));
    }
  }

  getTotalQuantity(): number {
    let total = 0;
    this.cartItemsSource.getValue().forEach(item => {
      total += item.quantity;
    });
    return total;
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSource.getValue();
  }

  clearCart() {
    this.updateCartItems([]);
    const cartItems = this.getCartItemsFromLocalStorage();
    this.updateCartItems(cartItems);
  }

  async clearCartFromUser() {
    const cartItems = this.getCartItems();
    for (let i = cartItems.length - 1; i >= 0; i--) {
      await this.removeFromCart(cartItems[i].id, i);
    }
  }

  async clearCartFromLocal() {
    if (this.isBrowser) {
      localStorage.removeItem('localCartItems');
    }
    this.updateCartItems([]);
  }

  setCartItems(cartItems: CartItem[]) {
    this.updateCartItems(cartItems);
  }

  generateRandomOrderNumber(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }
}
