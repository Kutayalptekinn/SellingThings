import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,RouterModule,ToastModule],
  providers: [MessageService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  cartItems: { id:number, product: any; quantity: number }[] = [];
  isCheckoutModalOpen: boolean = false;
  isModalOpen:boolean=false;
  selectedItemId: number | null = null;
selectedItemIndex: number | null = null;

  constructor(private cartService: CartService,
    private userService:UserService,
    private router:Router,
    private messageService: MessageService,

  ) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnInit() {
    this.cartService.fetchCartItems();
  }
  async goToOrderDetail() {
    

    this.router.navigate(['/order-detail']);
  }
  incrementQuantity(item: any) {
    this.cartService.addToCart(item.product, 1);
  }

  decrementQuantity(item: any) {
    if (item.quantity > 1) {
      this.cartService.addToCart(item.product,  -1);
    }
  }
  goToProducts() {
    this.router.navigate(['/product']);
  }
  removeItem(id: number, index: number) {
    this.cartService.removeFromCart(id, index);
    this.cartItems = this.cartService.getCartItems();
  }
  openModal(itemId: number, index: number) {
    this.selectedItemId = itemId;
    this.selectedItemIndex = index;
      this.isModalOpen = true;
  }
  confirmRemove() {
    if (this.selectedItemId !== null && this.selectedItemIndex !== null) {
      this.removeItem(this.selectedItemId, this.selectedItemIndex);
      this.selectedItemId = null;
      this.selectedItemIndex = null;
      this.isModalOpen = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ürünler başarı ile silindi!' });

    }
  }
  closeModal() {
    this.isModalOpen = false;
  }
  getTotalPrice() {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
  formatPrice(price: number): string {
    return price.toLocaleString('tr-TR'); // Nokta ile binlik ayracı
  }

  openCheckoutModal() {
    this.isCheckoutModalOpen = true;
  }

  closeCheckoutModal() {
    this.isCheckoutModalOpen = false;
  }

}
