import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface Chef {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-admin-add-chef',
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
  templateUrl: './admin-add-chef.component.html',
  styleUrls: ['./admin-add-chef.component.scss']
})
export class AdminAddChefComponent implements OnInit {
  addChefForm: FormGroup;
  deleteChefForm: FormGroup;
  selectedFile: File | null = null;
  chefs: Chef[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {
    this.addChefForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      specialty: ['', Validators.required],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      alloted: [0]
    });

    this.deleteChefForm = this.fb.group({
      chefId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadChefs();
  }

  loadChefs() {
    this.adminService.getChefs().subscribe({
      next: (chefs: Chef[]) => {
        this.chefs = chefs;
      },
      error: (err) => {
        this.snackBar.open('Error loading chefs: ' + (err.error?.msg || 'Unknown error'), 'Close', { duration: 3000 });
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit() {
    if (this.addChefForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.addChefForm.get('name')!.value);
      formData.append('email', this.addChefForm.get('email')!.value);
      formData.append('password', this.addChefForm.get('password')!.value);
      formData.append('specialty', this.addChefForm.get('specialty')!.value);
      formData.append('rating', this.addChefForm.get('rating')!.value);
      formData.append('alloted', this.addChefForm.get('alloted')!.value);
      formData.append('image', this.selectedFile);

      this.adminService.addChef(formData).subscribe({
        next: () => {
          this.snackBar.open('Chef added successfully', 'Close', { duration: 3000 });
          this.addChefForm.reset();
          this.selectedFile = null;
          this.loadChefs(); // Refresh chefs list
        },
        error: (err) => {
          this.snackBar.open('Error adding chef: ' + (err.error?.msg || 'Unknown error'), 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please fill all required fields and select an image', 'Close', { duration: 3000 });
    }
  }

  deleteChef() {
    if (this.deleteChefForm.valid) {
      const chefId = this.deleteChefForm.get('chefId')!.value;
      this.adminService.deleteChef(chefId).subscribe({
        next: () => {
          this.snackBar.open('Chef deleted successfully', 'Close', { duration: 3000 });
          this.deleteChefForm.reset();
          this.loadChefs(); // Refresh chefs list
        },
        error: (err) => {
          this.snackBar.open('Error deleting chef: ' + (err.error?.msg || 'Unknown error'), 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please select a chef', 'Close', { duration: 3000 });
    }
  }
}