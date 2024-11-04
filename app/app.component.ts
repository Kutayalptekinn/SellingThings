import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from "./components/footer/footer.component";
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { CommonModule } from '@angular/common'; // Ensure CommonModule is imported
import { ContactComponent } from './pages/contact/contact.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { FormsModule } from '@angular/forms';
import { CartComponent } from './pages/cart/cart.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/interceptor/interceptor.service'
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { PaymentComponent } from './pages/payment/payment.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterModule,
      CommonModule,
      FormsModule,
       HeaderComponent,
       HomeComponent,
       AboutComponent,
       ContactComponent,
       ProductComponent,
        FooterComponent,
        LoginComponent,
        SignInComponent,
        CartComponent,
        ForgotPasswordComponent,
        OrdersComponent,
      ProductDetailComponent,
    OrderDetailComponent,
    PaymentComponent,
  NewPasswordComponent],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
      ]
})
export class AppComponent {
  title = 'SellingThingsApp';
}
