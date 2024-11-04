import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private apiUrl = 'https://sellingthingsapi.shop/api';

  constructor() {}

  async sendPasswordResetLink(email: string): Promise<void> {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(`${this.apiUrl}/Mail/Send?email=${email}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const { token: resetToken, userId } = response.data;
      localStorage.setItem('resetToken', resetToken);
      localStorage.setItem('resetUserId', userId);
      const currentTime = new Date().getTime();
      localStorage.setItem('resetTime', currentTime.toString());
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async orderConfirmation(email: string, orderNo: string | number): Promise<void> {
    const token = localStorage.getItem('authToken');
    try {
      await axios.post(`${this.apiUrl}/Mail/OrderConfirmation?email=${email}&orderNo=${orderNo}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
