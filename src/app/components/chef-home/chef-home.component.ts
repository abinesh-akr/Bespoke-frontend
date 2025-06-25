import { Component, OnInit } from '@angular/core';
import { ChefService } from '../../services/chef.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

interface Chef {
  name: string;
  email: string;
  specialty: string;
  image?: string;
}

@Component({
  selector: 'app-chef-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './chef-home.component.html',
  styleUrls: ['./chef-home.component.scss']
})
export class ChefHomeComponent implements OnInit {
  orders: any[] = [];
  ordersLoaded = false;
  chef: Chef | null = null;
  showProfile: boolean = false;

  constructor(private chefService: ChefService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadOrders();
    this.loadChefProfile();
  }

  loadOrders() {
    this.chefService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.ordersLoaded = true;
        this.snackBar.open('Orders loaded successfully', 'Close', { duration: 3000 });
      },
      error: (err) => this.snackBar.open('Error loading orders: ' + err.error.msg, 'Close', { duration: 3000 })
    });
  }

  completeOrder(orderId: string) {
    this.chefService.completeOrder(orderId).subscribe({
      next: (updatedOrder) => {
        this.snackBar.open('Order marked as Out for delivery', 'Close', { duration: 3000 });
        this.orders = this.orders.map(order => order._id === orderId ? updatedOrder : order);
      },
      error: (err: ErrorEvent) => this.snackBar.open('Error completing order: ' + err.error.msg, 'Close', { duration: 3000 })
    });
  }

  loadChefProfile() {
    // Assuming ChefService has a method to fetch the logged-in chef's profile
    // If this method doesn't exist, you can mock the data or implement the service method
    this.chefService.getChefProfile().subscribe({
      next: (chef) => {
        console.log(chef);
        this.chef = chef;
      },
      error: (err) => {
        this.snackBar.open('Error loading profile: ' + err.error.msg, 'Close', { duration: 3000 });
        // Fallback mock data in case of error
        this.chef = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          specialty: 'Italian Cuisine',
          image: 'https://images.pexels.com/photos/3812944/pexels-photo-3812944.jpeg?auto=compress&cs=tinysrgb&w=200'
        };
      }
    });
  }

  toggleProfile(): void {
    this.showProfile = !this.showProfile;
  }
}