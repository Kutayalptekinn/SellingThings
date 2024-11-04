import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CommonModule,registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import localeTr from '@angular/common/locales/tr';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: any[] | undefined;
  urlApi = "https://sellingthingsapi.shop/";

  constructor(private productService: ProductService) {
    registerLocaleData(localeTr, 'tr');
  }

  async ngOnInit() {
    try {
      this.products = await this.productService.getProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  formatPrice(price: number): string {
    return price.toLocaleString('tr-TR'); // Nokta ile binlik ayracı
  }
  getStarClass(productRating: number, star: number): string {
    const fullStars = Math.floor(productRating);
    const hasHalfStar = !Number.isInteger(productRating);
    const halfStarIndex = hasHalfStar ? Math.ceil(productRating) : -1;

    if (star <= fullStars) {
      return 'fa-star text-yellow-500';
    } else if (star === halfStarIndex) {
      return 'fa-star-half-alt text-yellow-500';
    } else {
      return 'fa-star text-gray-300';
    }
  }

  getStarFillPercentage(productRating: number, star: number): string {
    const fullStars = Math.floor(productRating);
    if (star <= fullStars) {
      return '100%';
    } else if (star === fullStars + 1) {
      const fractionalPart = productRating - fullStars;
      return `${fractionalPart * 100}%`;
    } else {
      return '0%';
    }
  }
}
