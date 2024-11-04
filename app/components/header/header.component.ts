import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  quantity: number = 0;
  dropdownOpen = false;
  mobileMenuOpen = false; // Mobil menü kontrolü

  constructor(public userService: UserService, private cartService: CartService) {}

  ngOnInit() {
    this.cartService.fetchCartItems();
    this.cartService.cartItems$.subscribe(items => {
      this.quantity = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.userService.logout();
    this.dropdownOpen = false;
  }

  // Mobil menüyü açıp kapatma işlemi
  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // Menüyü kapatma işlemi
  closeMenu() {
    this.mobileMenuOpen = false;
  }
}
