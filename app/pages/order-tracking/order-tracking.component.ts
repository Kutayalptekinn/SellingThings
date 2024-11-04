import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order/order.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Order {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  status: string;
  orderDate: string;
  orderNo: string;
  product: any;
}

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule,ToastModule],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css',
  providers: [MessageService]

})
export class OrderTrackingComponent {
  orderNumber: string = '';
  filteredOrders: Order[] = [];
  orders: Order[] = [];
  selectedOrderId: number | null = null;
  selectedOrder: Order | null = null; // Ensure this is correctly typed and initialized
 
  constructor(private orderService: OrderService,
    private messageService: MessageService,

  ) {}

  searchOrder() {
    if (this.orderNumber) {
      this.orderService.getOrdersByTrackingNumber(this.orderNumber).then(orders => {
        this.filteredOrders = orders;
      }).catch(error => {
        console.error('Error fetching orders:', error);
      });
    } else {
      this.filteredOrders = [];
      //bulunamadı
    }
  }

  openModal(orderId: number) {
    this.selectedOrder = this.filteredOrders.find(order => order.id === orderId) || null;
    if (this.selectedOrder) {
      const modal = document.getElementById("returnModal");
      if (modal) {
        modal.classList.remove("hidden");
      }
    }
  }

  closeModal() {
    this.selectedOrder = null;
    const modal = document.getElementById("returnModal");
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  submitReturn() {
      const reason = (document.getElementById("returnReason") as HTMLTextAreaElement).value;
      if (this.selectedOrder && reason) {
        this.selectedOrder.status = "İade Sürecinde";

        // Backend'e güncellemeyi gönderin
        this.orderService.updateOrder(this.selectedOrder)
          .then(() => {
            this.closeModal();
          })
          .catch(error => {
            console.error('Error submitting return request:', error);
          });

          this.orders = this.orders.map(order =>
            order.id === this.selectedOrder!.id ? { ...order, status: "İade Sürecinde" } : order
          );
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'İade Talebi Alındı!' });

        // İade etme işlemi burada gerçekleştirilir.
        console.log(`Sipariş ID: ${this.selectedOrder.id}, İade Sebebi: ${reason}`);
        this.closeModal();
      } else {
        alert("Lütfen iade sebebinizi girin.");
      }
    }




}
