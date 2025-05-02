import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-admin-modify-foods',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './admin-modify-foods.component.html',
  styleUrls: ['./admin-modify-foods.component.scss']
})
export class AdminModifyFoodsComponent implements OnInit {
  modifyFoodForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {
    this.modifyFoodForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      image: [''],
      chef: [''],
      bespokeOption: [''],
      tags: ['']
    });
  }

  ngOnInit() {}

  onUpdate() {
    if (this.modifyFoodForm.valid) {
      const { id, name, price, image, chef, bespokeOption, tags } = this.modifyFoodForm.value;
      const foodData = {
        name,
        price,
        image,
        chef,
        bespokeOption,
        tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : []
      };
      this.adminService.updateFood(id, foodData).subscribe({
        next: () => {
          this.snackBar.open('Food updated successfully', 'Close', { duration: 3000 });
          this.modifyFoodForm.reset();
        },
        error: (err) => this.snackBar.open('Error updating food: ' + err.error.msg, 'Close', { duration: 3000 })
      });
    }
  }

  onDelete() {
    const id = this.modifyFoodForm.get('id')?.value;
    if (id) {
      this.adminService.deleteFood(id).subscribe({
        next: () => {
          this.snackBar.open('Food deleted successfully', 'Close', { duration: 3000 });
          this.modifyFoodForm.reset();
        },
        error: (err) => this.snackBar.open('Error deleting food: ' + err.error.msg, 'Close', { duration: 3000 })
      });
    } else {
      this.snackBar.open('Please provide a food ID', 'Close', { duration: 3000 });
    }
  }
}