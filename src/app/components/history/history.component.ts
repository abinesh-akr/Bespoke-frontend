import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Added for *ngFor
import { OrderService } from '../../services/order.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule, // Added for *ngFor
    MatCardModule,
    MatSnackBarModule,
    NavbarComponent
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  orders: any[] = [];

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.orderService.getOrderHistory().subscribe({
      next: (data) => {
        this.orders = data;
        
      },
      error: () => {
        this.snackBar.open('Failed to load history', 'Close', { duration: 3000 });
      }
    });
  }
}