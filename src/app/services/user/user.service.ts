import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { CartService } from '../cart/cart.service';

interface CustomJwtPayload {
  id: string;
  surname: string;
  email: string;
  name: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  jti: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isBrowser: boolean;
  private apiUrl = 'https://sellingthingsapi.shop/api/User';
  private userName: string | null = null; 
  private userSurName: string | null = null; 
  private userMail: string | null = null; 
  private isLoggedIn = false;
  private cartService: CartService | null = null; // Initially set to null

  constructor(
    private router: Router,
    private injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async login(email: string, password: string) {
    const token = localStorage.getItem('authToken');
    return axios.post(`${this.apiUrl}/LoginAsync?email=${email}&password=${password}`, null, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private getCartService(): CartService {
    if (!this.cartService) {
      this.cartService = this.injector.get(CartService);
    }
    return this.cartService;
  }

  logout() {
    const cartService = this.getCartService();
    cartService.clearCart();

    if (this.isBrowser) {
      localStorage.removeItem('authToken');
    }
    this.router.navigate(['/login']);
  }

  saveCartToLocalStorage() {
    if (this.isBrowser) {
      const cartService = this.getCartService();
      const cartItems = cartService.getCartItems();
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }

  loadCartFromLocalStorage() {
    if (this.isBrowser) {
      const cartService = this.getCartService();
      const cartItems = localStorage.getItem('cartItems');
      if (cartItems) {
        cartService.setCartItems(JSON.parse(cartItems));
      }
    }
  }

  getUserDetails() {
    if (this.isBrowser) {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decode = jwtDecode<CustomJwtPayload>(token);
        if (decode) {
          this.userName = decode.name;
          this.userSurName = decode.surname;
          this.userMail = decode.email;
          return decode;
        }
      }
    }
    return null;
  }

  async getUserById(id: number): Promise<any> {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${this.apiUrl}/GetAsync?id=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  isUserLoggedIn() {
    return this.isBrowser && !!localStorage.getItem('authToken');
  }

  async createUser(user: { id: number, name: string, surname: string, mail: string, password: string }) {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(`${this.apiUrl}/InsertAsync`, user, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
