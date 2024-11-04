import { Injectable } from '@angular/core';
import axios from 'axios';
import { UserService } from '../user/user.service';

interface Order {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  status: string;
  orderDate: string;
  orderNo: string;
  product: any;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private userService: UserService) {}

  async getOrders(): Promise<Order[]> {
    const user = this.userService.getUserDetails();
    const token = localStorage.getItem('authToken');
    if (!user) {
      throw new Error('User not logged in');
    }
    try {
      const response = await axios.get('https://sellingthingsapi.shop/api/Order/GetByUserIdAsync', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params: { userId: user.id }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getPaymentHtml() {
    const token = localStorage.getItem('authToken');
    const url = 'https://sellingthingsapi.shop/api/Order/OdemeAsync';
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Ödeme sırasında hata:', error);
      throw error;
    }
  }

  async updateOrder(order: Order): Promise<void> {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.put(`https://sellingthingsapi.shop/api/Order/UpdateAsync`, order, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Order updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async getOrdersByTrackingNumber(trackingNumber: string): Promise<Order[]> {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`https://sellingthingsapi.shop/api/Order/GetByTrackingNumberAsync`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params: { trackingNumber: trackingNumber }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

}
