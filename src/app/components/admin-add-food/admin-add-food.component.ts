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
  selector: 'app-admin-add-food',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './admin-add-food.component.html',
  styleUrls: ['./admin-add-food.component.scss']
})
export class AdminAddFoodComponent implements OnInit {
  addFoodForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {
    this.addFoodForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantityAvailable: ['', [Validators.required, Validators.min(0)]],
      bespokeOption: [''],
      tags: ['']
    });
  }

  ngOnInit() {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit() {
    if (this.addFoodForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.addFoodForm.get('name')?.value);
      formData.append('price', this.addFoodForm.get('price')?.value);
      formData.append('quantityAvailable', this.addFoodForm.get('quantityAvailable')?.value);
      formData.append('bespokeOption', this.addFoodForm.get('bespokeOption')?.value || '');
      formData.append('tags', this.addFoodForm.get('tags')?.value || '');
      formData.append('image', this.selectedFile);

      this.adminService.addFood(formData).subscribe({
        next: () => {
          this.snackBar.open('Food added successfully', 'Close', { duration: 3000 });
          this.addFoodForm.reset();
          this.selectedFile = null;
        },
        error: (err) => {
          this.snackBar.open('Error adding food: ' + (err.error.msg || 'Unknown error'), 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please fill all required fields and select an image', 'Close', { duration: 3000 });
    }
  }
}