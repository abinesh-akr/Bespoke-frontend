import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  foods: any[] = [];
  filteredFoods: any[] = [];
  searchTerm: string = '';
  user: any = { preferences: ['Italian', 'Mexican'] }; // Mock user data

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:5000/api/food').subscribe({
      next: (foods: any) => {
        this.foods = foods.map((food: any) => ({
          ...food,
          bespokeNote: '' // Initialize bespokeNote
        }));
        this.filteredFoods = this.foods;
      },
      error: (error) => {
        console.error('Load foods error:', error);
      }
    });
  }

  filterFoods() {
    if (!this.searchTerm) {
      this.filteredFoods = this.foods;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredFoods = this.foods.filter(
        (food) =>
          food.name.toLowerCase().includes(term) ||
          food.tags?.some((tag: string) => tag.toLowerCase().includes(term))
      );
    }
  }

  addToCart(food: any) {
    if (food.quantityAvailable < 1) {
      console.log('Item out of stock:', food.name);
      return;
    }

    const cartItem = {
      foodId: food._id,
      name: food.name,
      price: food.price,
      image: food.image,
      bespokeNote: food.bespokeNote || '',
      quantity: 1
    };

    let cart: any[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item) => item.foodId === food._id && item.bespokeNote === food.bespokeNote);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Added to cart:', cartItem);
    console.log('Current cart:', cart);
  }

  getCartItems() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }
}