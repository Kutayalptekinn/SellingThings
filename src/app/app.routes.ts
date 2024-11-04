import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AuthGuard } from './services/authGuard/authGuard.service';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { OrderTrackingComponent } from './pages/order-tracking/order-tracking.component';
import { IptalIadeComponent } from './pages/iptal-iade/iptal-iade.component';
import { GizlilikComponent } from './pages/gizlilik/gizlilik.component';
import { HizmetKosullariComponent } from './pages/hizmet-kosullari/hizmet-kosullari.component';
import { MesafeliSatisComponent } from './pages/mesafeli-satis/mesafeli-satis.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { PaymentComponent } from './pages/payment/payment.component';

export const routes: Routes = [

    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'product', component: ProductComponent },
    { path: 'product-detail/:id', component: ProductDetailComponent },
    { path: 'login', component: LoginComponent,canActivate: [AuthGuard] },
    { path: 'sign-in', component: SignInComponent,canActivate: [AuthGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent,canActivate: [AuthGuard] },
    { path: 'cart', component: CartComponent},
    { path: 'orders', component: OrdersComponent },
    { path: 'order-detail', component: OrderDetailComponent },
    { path: 'order-tracking', component:OrderTrackingComponent },
    { path: 'iptal-iade', component: IptalIadeComponent },
    { path: 'gizlilik', component: GizlilikComponent },
    { path: 'hizmet-kosullari', component: HizmetKosullariComponent },
    { path: 'mesafeli-satis', component: MesafeliSatisComponent },
    { path: 'new-password/:userId/:token', component: NewPasswordComponent },
    { path: 'payment', component: PaymentComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }