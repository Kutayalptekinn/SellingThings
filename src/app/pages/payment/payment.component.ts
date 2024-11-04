import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  paymentHtml: SafeHtml | undefined;
  constructor(private orderService: OrderService,private sanitizer: DomSanitizer
  ) {}
  async ngOnInit() {
    

    const iframeHtml = await this.orderService.getPaymentHtml();
    this.paymentHtml = this.sanitizer.bypassSecurityTrustHtml(iframeHtml); // Güvenli HTML'e çevir
  }
}
