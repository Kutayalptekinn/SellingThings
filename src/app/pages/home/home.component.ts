import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import localeTr from '@angular/common/locales/tr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] | undefined;
  urlApi = "https://sellingthingsapi.shop/";

  constructor(private productService: ProductService) {
    // Türkiye yerelini kaydediyoruz
    registerLocaleData(localeTr, 'tr');
  }

  async ngOnInit() {
    try {
      this.products = await this.productService.getProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  getStarFillPercentage(rating: number, star: number): string {
    const percentage = (rating - (star - 1)) / 1 * 100;
    return `${Math.min(Math.max(percentage, 0), 100)}%`;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('tr-TR'); // Nokta ile binlik ayracı
  }
}
