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
  cart: { items: any[] } = { items: [] };
  isLoading: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (data: { items: any[] }) => {
        console.log('Cart loaded:', JSON.stringify(data, null, 2));
        this.cart = data || { items: [] };
        if (!this.cart.items || this.cart.items.length === 0) {
          this.snackBar.open('Cart is empty', 'Close', { duration: 3000 });
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading cart:', err);
        this.snackBar.open(err.error.msg, 'Close', { duration: 3000 });
        this.cart = { items: [] };
        this.isLoading = false;
      }
    });
  }

  updateQuantity(item: any) {
    if (this.isLoading) return; // Prevent multiple simultaneous updates
    this.isLoading = true;

    if (item.quantity < 0) {
      item.quantity = 0; // Prevent negative quantities
    }
    if (item.quantity > item.food.quantityAvailable) {
      item.quantity = item.food.quantityAvailable; // Cap at available quantity
      this.snackBar.open(`Cannot exceed available quantity (${item.food.quantityAvailable})`, 'Close', { duration: 3000 });
    }

    const updatedItem = {
      foodId: item.food._id,
      quantity: item.quantity,
      bespokeNote: item.bespokeNote || ''
    };

    this.cartService.updateCartItem(updatedItem).subscribe({
      next: (response: { items: any[] }) => {
        console.log('Quantity updated, response:', JSON.stringify(response, null, 2));
        this.loadCart();
        if (response && response.items !== undefined) {
          this.cart = response; // Update cart with full response
          this.snackBar.open(item.quantity === 0 ? 'Item removed from cart' : 'Quantity updated successfully', 'Close', { duration: 3000 });
        } else {
          console.error('Invalid response from updateCartItem:', response);
          this.snackBar.open('Failed to update cart: Invalid response', 'Close', { duration: 3000 });
          this.loadCart(); // Fallback to reload cart
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error updating quantity:', err);
        this.snackBar.open('Failed to update quantity: ' + (err.error?.msg || 'Unknown error'), 'Close', { duration: 3000 });
        this.loadCart(); // Reload cart on error to ensure consistency
        this.isLoading = false;
      }
    });
  }

  checkout() {
    if (this.isLoading) return;
    this.router.navigate(['/payment']);
  }
}