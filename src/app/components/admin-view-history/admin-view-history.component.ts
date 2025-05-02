import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-admin-view-history',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule],
  templateUrl: './admin-view-history.component.html',
  styleUrls: ['./admin-view-history.component.scss']
})
export class AdminViewHistoryComponent {
  orders: any[] = [];
  ordersLoaded = false;

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.adminService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.ordersLoaded = true;
        this.snackBar.open('Orders loaded successfully', 'Close', { duration: 3000 });
      },
      error: (err) => this.snackBar.open('Error loading orders: ' + err.error.msg, 'Close', { duration: 3000 })
    });
    console.log(this.orders);
  }
}