import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { FoodService, Food } from '../../services/food.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-admin-modify-foods',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './admin-modify-foods.component.html',
  styleUrls: ['./admin-modify-foods.component.scss']
})
export class AdminModifyFoodsComponent implements OnInit {
  modifyFoodForm: FormGroup;
  selectedFile: File | null = null;
  foods: Food[] = [];
  selectedFood: Food | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private foodService: FoodService,
    private snackBar: MatSnackBar
  ) {
    this.modifyFoodForm = this.fb.group({
      foodId: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantityAvailable: ['', [Validators.required, Validators.min(0)]],
      bespokeOption: [''],
      tags: [''],
      rating: [{ value: '', disabled: true }], // Display-only
      chef: [{ value: '', disabled: true }] // Display-only
    });
  }

  ngOnInit() {
    this.loadFoods();
    // Listen for foodId changes to populate form
    this.modifyFoodForm.get('foodId')?.valueChanges.subscribe(foodId => {
      const selectedFood = this.foods.find(food => food._id === foodId);
      if (selectedFood) {
        this.selectedFood = selectedFood;
        this.modifyFoodForm.patchValue({
          name: selectedFood.name,
          price: selectedFood.price,
          quantityAvailable: selectedFood.quantityAvailable || 0, // Default if not present
          bespokeOption: selectedFood.bespokeOption || '',
          tags: selectedFood.tags ? selectedFood.tags.join(', ') : '',
          rating: selectedFood.rating || 0,
          chef: selectedFood.chef ? selectedFood.chef.name : ''
        });
      }
    });
  }

  loadFoods() {
    this.foodService.getFoods().subscribe({
      next: (foods: Food[]) => {
        this.foods = foods;
      },
      error: (err) => {
        this.snackBar.open('Error loading foods: ' + (err.error?.msg || 'Unknown error'), 'Close', { duration: 3000 });
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onUpdate() {
    if (this.modifyFoodForm.valid) {
      const { foodId, name, price, quantityAvailable, bespokeOption, tags } = this.modifyFoodForm.value;
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('quantityAvailable', quantityAvailable);
      formData.append('bespokeOption', bespokeOption || '');
      formData.append('tags', tags || '');
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.adminService.updateFood(foodId, formData).subscribe({
        next: () => {
          this.snackBar.open('Food updated successfully', 'Close', { duration: 3000 });
          this.modifyFoodForm.reset();
          this.selectedFile = null;
          this.selectedFood = null;
          this.loadFoods(); // Refresh food list
        },
        error: (err) => {
          this.snackBar.open('Error updating food: ' + (err.error?.msg || 'Unknown error'), 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
    }
  }

  onDelete() {
    const foodId = this.modifyFoodForm.get('foodId')?.value;
    if (foodId) {
      this.adminService.deleteFood(foodId).subscribe({
        next: () => {
          this.snackBar.open('Food deleted successfully', 'Close', { duration: 3000 });
          this.modifyFoodForm.reset();
          this.selectedFile = null;
          this.selectedFood = null;
          this.loadFoods(); // Refresh food list
        },
        error: (err) => {
          this.snackBar.open('Error deleting food: ' + (err.error?.msg || 'Unknown error'), 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please select a food', 'Close', { duration: 3000 });
    }
  }
}