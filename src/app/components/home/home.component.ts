import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../services/food.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  foods: any[] = [];
  filteredFoods: any[] = [];
  searchTerm: string = '';
  user: any;

  constructor(
    private foodService: FoodService,
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.foodService.getFoods().subscribe({
      next: (data: any[]) => {
        console.log('Fetched foods:', data);
        this.foods = data.map(food => ({
          ...food,
          tags: Array.isArray(food.tags) ? food.tags : []
        }));
        this.filteredFoods = this.foods;
      },
      error: (err: any) => {
        console.error('Error fetching foods:', err);
        this.snackBar.open('Failed to load foods', 'Close', { duration: 3000 });
      }
    });
  }

  filterFoods() {
    this.filteredFoods = this.foods.filter(food =>
      food.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (food.tags && food.tags.some((tag: string) => tag.toLowerCase().includes(this.searchTerm.toLowerCase())))
    );
  }

  addToCart(food: any) {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Please log in to add items to cart', 'Close', { duration: 3000 });
      return;
    }

    if (food.quantityAvailable < 1) {
      this.snackBar.open('This item is out of stock', 'Close', { duration: 3000 });
      return;
    }

    const item = {
      foodId: food._id,
      quantity: 1,
      bespokeNote: food.bespokeNote || ''
    };
    this.cartService.addToCart(item).subscribe({
      next: (cart: any) => {
        console.log('Added to cart:', food);
        console.log('Backend response:', cart);
        this.snackBar.open(`${food.name} added to cart!`, 'Close', { duration: 3000 });
      },
      error: (err: any) => {
        console.error('Error adding to cart:', err);
        this.snackBar.open('Failed to add to cart', 'Close', { duration: 3000 });
      }
    });
  }
}