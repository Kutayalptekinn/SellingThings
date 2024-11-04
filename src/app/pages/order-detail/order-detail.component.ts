import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';
import { UserService } from '../../services/user/user.service';
import { RouterModule, Router } from '@angular/router';
import { MailService } from '../../services/mail/mail.service';
import { OrderService } from '../../services/order/order.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface OrderItem {
  product: any;
  quantity: number;
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  sameAsShipping: boolean = true;
  orderItems: OrderItem[] = []; 
  subTotal: number = 0;
  shippingCost: number = 0;
  total: number = 0;
  isModalOpen: boolean = false;
  isPaymentModalOpen: boolean = false;
  paymentHtml: SafeHtml | undefined;

  // Form field variables
  userId!: number;
  userEmail: string = '';
  firstName: string = '';
  lastName: string = '';
  address: string = '';
  streetDetails: string = '';
  postalCode: string = '';
  city: string = '';
  phone: string = '';
  billingAddress: string = '';
  billingStreetDetails: string = '';
  billingPostalCode: string = '';
  billingCity: string = '';
  billingPhone: string = '';

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private router: Router,
    private mailService: MailService,
    private orderService: OrderService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    this.loadUserDetails();
    await this.loadOrderItems();
  }

  private loadUserDetails() {
    const user = this.userService.getUserDetails();
    if (user) {
      this.userId = Number(user.id);
      this.userEmail = user.email;
      this.firstName = user.name || '';
      this.lastName = user.surname || '';
    }
  }
  selectAddress(isSame: boolean) {
    this.sameAsShipping = isSame;
  }
  private async loadOrderItems() {
    const cartItems: { product: any; quantity: number }[] = await this.cartService.fetchCartItems();
    this.orderItems = cartItems.map((item: { product: any; quantity: number }) => ({
        product: item.product,
        quantity: item.quantity
    }));
    this.calculateTotals();
}

  private calculateTotals() {
    this.subTotal = this.orderItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    this.shippingCost = Math.floor(Math.random() * 100) + 10; // Random shipping cost
    this.total = this.subTotal + this.shippingCost;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  async confirmOrder() {
    const orderDetails = {
        userEmail: this.userEmail,
        firstName: this.firstName,
        lastName: this.lastName,
        address: this.address,
        streetDetails: this.streetDetails,
        postalCode: this.postalCode,
        city: this.city,
        phone: this.phone,
        billingAddress: this.billingAddress,
        billingStreetDetails: this.billingStreetDetails,
        billingPostalCode: this.billingPostalCode,
        billingCity: this.billingCity,
        billingPhone: this.billingPhone,
        sameAsShipping: this.sameAsShipping
    };

    // Call createOrderFromCart with the orderDetails object
    const orderNo = await this.cartService.createOrderFromCart(orderDetails);

    // Send order confirmation email
    await this.mailService.orderConfirmation(this.userEmail, orderNo);

    // Clear cart based on user authentication
    if (this.userService.getUserDetails()) {
        await this.cartService.clearCartFromUser();
    } else {
        await this.cartService.clearCartFromLocal();
    }

    // Get payment HTML and handle payment modal
    const iframeHtml = await this.orderService.getPaymentHtml();
    this.paymentHtml = this.sanitizer.bypassSecurityTrustHtml(iframeHtml);
    this.closeModal();
    this.openPaymentModal();
}
goToProducts() {
  this.router.navigate(['/product']);
}
validateForm(): boolean {
  // Check if all required fields are filled
  if (!this.firstName || !this.lastName || !this.address || !this.city || !this.phone || !this.userEmail) {
    return false;
  }
  
  if (!this.sameAsShipping) {
    // Check billing address fields if not same as shipping
    if (!this.billingAddress || !this.billingCity || !this.billingPhone) {
      return false;
    }
  }

  return true;
}
openModal() {

  if (!this.validateForm()) {
    return;
  }
  else{
    this.isModalOpen = true;
  }
}

closeModal() {
  this.isModalOpen = false;
}

openPaymentModal() {


    this.isPaymentModalOpen = true;
}

closePaymentModal() {
  this.isPaymentModalOpen = false;
}
}
