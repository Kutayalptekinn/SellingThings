import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async getProducts() {
    const token = this.isBrowser ? localStorage.getItem('authToken') : null; // Tarayıcıda olup olmadığımızı kontrol ediyoruz
    try {
      const response = await axios.get('https://sellingthingsapi.shop/api/Product/GetListAsync', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined // Token yoksa undefined yap
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: number) {
    const token = this.isBrowser ? localStorage.getItem('authToken') : null; // Tarayıcıda olup olmadığımızı kontrol ediyoruz
    try {
      const response = await axios.get(`https://sellingthingsapi.shop/api/Product/GetAsync?id=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined // Token yoksa undefined yap
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async updateProduct(product: any) {
    const token = this.isBrowser ? localStorage.getItem('authToken') : null; // Tarayıcıda olup olmadığımızı kontrol ediyoruz
    try {
      const response = await axios.put('https://sellingthingsapi.shop/api/Product/UpdateAsync', product, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined // Token yoksa undefined yap
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
}
