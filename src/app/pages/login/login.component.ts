import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Toast, ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CartService } from '../../services/cart/cart.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrected the property name from 'styleUrl' to 'styleUrls'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {}

  onLogin() {
    this.userService.login(this.email, this.password)
      .then(response => {
        const token = response.data.token;
        if (isPlatformBrowser(this.platformId)) { // Check if running in the browser
          localStorage.setItem('authToken', token);
        }
        this.cartService.fetchCartItems();
        this.router.navigate(['/']);
      })
      .catch(error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.response.data.message });
      });
  }
}
