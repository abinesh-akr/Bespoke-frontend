import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    NavbarComponent
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: { items: any[] } = { items: [] }; // Define type for cart

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (data: { items: any[] }) => {
        console.log('Cart loaded:', JSON.stringify(data, null, 2));
        this.cart = data || { items: [] };
        if (!this.cart.items || this.cart.items.length === 0) {
          this.snackBar.open('Cart is empty', 'Close', { duration: 3000 });
        }
      },
      error: (err: any) => {
        console.error('Error loading cart:', err);
        this.snackBar.open('Failed to load cart', 'Close', { duration: 3000 });
        this.cart = { items: [] };
      }
    });
  }

  updateRating(item: any) {
    this.cartService.updateCartItem(item).subscribe({
      next: (response: any) => {
        console.log('Rating updated:', response);
        this.snackBar.open('Rating updated successfully', 'Close', { duration: 3000 });
      },
      error: (err: any) => {
        console.error('Error updating rating:', err);
        this.snackBar.open('Failed to update rating', 'Close', { duration: 3000 });
      }
    });
  }
  checkout(){
    this.router.navigate(['/payment']);
  }
  
  
}