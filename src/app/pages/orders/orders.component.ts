import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import axios from 'axios';
import { CommonModule } from '@angular/common';
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
  product:any;

}
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,ToastModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  providers: [MessageService]

})



export class OrdersComponent {
  orders: Order[] = [];
  selectedOrderId: number | null = null;
  selectedOrder: Order | null = null; // Ensure this is correctly typed and initialized
  

  constructor(private orderService: OrderService,
    private messageService: MessageService,

  ) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getOrders().then(orders => {
      this.orders = orders;
    }).catch(error => {
      console.error('Error fetching orders:', error);
    });
  }


  openModal(orderId: number) {
    this.selectedOrder = this.orders.find(order => order.id === orderId) || null;
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

