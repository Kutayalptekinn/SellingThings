import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'https://sellingthingsapi.shop/api';

  constructor() {}

  async createComment(comment: { 
    id: number;
    productId: number;
    userId: number;
    comment: string;
    rating: number;
    photo1: string;
    photo2: string;
    photo3: string;
    photo4: string;
  }) {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(`${this.apiUrl}/Comment/InsertAsync`, comment, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.error('Error inserting comment:', error);
      throw error;
    }
  }
}
