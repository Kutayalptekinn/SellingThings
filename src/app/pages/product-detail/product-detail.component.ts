import { CommonModule,registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart/cart.service';
import { CommentService } from '../../services/comment/comment.service';
import { UserService } from '../../services/user/user.service';
import localeTr from '@angular/common/locales/tr';
import { MessageService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';

interface User{
  name:string;
  surname:string
}
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule,ToastModule],
  providers: [MessageService],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {
  product: any;
  urlApi = "https://sellingthingsapi.shop/";
  stars = [1, 2, 3, 4, 5];
  quantity = 1;
  showReviewForm = false;
  showModal = false;
  showImageModal = false;
  showLoginAlert = false; // Giriş uyarısını göstermek için
  selectedImage: string | null = null;
  newComment = { comment: '', rating: null as number | null, images: [] as string[] };
  mainImage: string = '';
  images: string[] = [];
  user: User | undefined;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private commentService: CommentService,
    private cartService: CartService,
    private userService: UserService,
    private messageService: MessageService,

  ) {
    registerLocaleData(localeTr, 'tr');
  }

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id !== null) {
        const productId = +id;
        try {
          this.product = await this.productService.getProductById(productId);
          this.mainImage = `${this.urlApi}${this.product.photo1}`;
          this.selectedImage = this.mainImage;
  
          this.images = [
            this.product.photo1 && `${this.urlApi}${this.product.photo1}`,
            this.product.photo2 && `${this.urlApi}${this.product.photo2}`,
            this.product.photo3 && `${this.urlApi}${this.product.photo3}`,
            this.product.photo4 && `${this.urlApi}${this.product.photo4}`
          ].filter(Boolean);
  
          if (this.product.comments) {
            this.product.comments = await Promise.all(
              this.product.comments.map(async (comment: any) => {
                const user = await this.userService.getUserById(comment.userId);
                comment.user = user.name + " " + user.surname;
                comment.images = [
                  comment.photo1 && `${this.urlApi}${comment.photo1}`,
                  comment.photo2 && `${this.urlApi}${comment.photo2}`,
                  comment.photo3 && `${this.urlApi}${comment.photo3}`,
                  comment.photo4 && `${this.urlApi}${comment.photo4}`
                ].filter(Boolean);
                return comment;
              })
            );
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
    });
  }
  formatPrice(price: number): string {
    return price.toLocaleString('tr-TR'); // Nokta ile binlik ayracı
  }
  handleThumbnailClick(image: string): void {
    this.mainImage = image;
    this.selectedImage = image;
  }
  checkLoginBeforeOpenModal() {
    if (!this.userService.isUserLoggedIn()) {  // isUserLoggedIn bir fonksiyon olmalı
      this.showLoginAlert = true;
    } else {
      this.openModal();
    }
  }
  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  async addToCart() {
    try {
      await this.cartService.addToCart(this.product, this.quantity);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ürün başarıyla sepete eklendi!' });

      // Başarılı olduğunda yapılacak işlemler
    } catch (error) {
      // Hata durumunda yapılacak işlemler
      console.error('Error adding to cart:', error);
    }
  }

  async addComment() {
    if (this.newComment.comment.trim() && this.newComment.rating !== null) {
      const user = this.userService.getUserDetails();
      if (!user) {
        // Kullanıcı giriş yapmamışsa giriş yapması gerektiğini belirten uyarıyı göster
        this.showLoginAlert = true;
        return;
      }
      const comment = {
        id: 0,
        productId: this.product.id,
        userId: Number(user?.id),
        comment: this.newComment.comment,
        rating: this.newComment.rating,
        photo1: this.newComment.images[0] || "",
        photo2: this.newComment.images[1] || "",
        photo3: this.newComment.images[2] || "",
        photo4: this.newComment.images[3] || ""
      };
      try {
        const result = await this.commentService.createComment(comment);
        if (result.data.id > 0) {
          this.product.comments.push({
            user: user?.name,
            comment: this.newComment.comment,
            rating: this.newComment.rating,
            images: this.newComment.images
          });
          const totalRatings = this.product.comments.reduce((sum: number, comment: any) => sum + comment.rating, 0);
          const newRating = totalRatings / this.product.comments.length;

          this.product.rating = newRating;
          await this.productService.updateProduct(this.product);
          this.newComment = { comment: '', rating: null, images: [] };
          this.closeModal();
        }
      } catch (error) {
        console.error('Error inserting comment:', error);
      }
    }
  }

  getStarFillPercentage(rating: number, star: number): string {
    const fullStars = Math.floor(rating);
    if (star <= fullStars) {
      return '100%';
    } else if (star === fullStars + 1) {
      const fractionalPart = rating - fullStars;
      return `${fractionalPart * 100}%`;
    } else {
      return '0%';
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.showLoginAlert = false; // Uyarı kapatılınca uyarı da kapansın
  }

  openImageModal(image: string) {
    this.selectedImage = image;
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
    this.selectedImage = null;
  }

  rateProduct(star: number) {
    this.newComment.rating = star;
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files.length) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.newComment.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.newComment.images.splice(index, 1);
  }
}
