import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-add-chef',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './admin-add-chef.component.html',
  styleUrls: ['./admin-add-chef.component.scss']
})
export class AdminAddChefComponent implements OnInit {
  addChefForm: FormGroup;
  chefId = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {
    this.addChefForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      image: ['', Validators.required],
      specialty: ['', Validators.required],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      allotted : [0]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.addChefForm.valid) {
      this.adminService.addChef(this.addChefForm.value).subscribe({
        next: () => {
          this.snackBar.open('Chef added successfully', 'Close', { duration: 3000 });
          this.addChefForm.reset();
        },
        error: (err) => this.snackBar.open('Error adding chef: ' + err.error.msg, 'Close', { duration: 3000 })
      });
    }
  }

  deleteChef() {
    if (this.chefId) {
      this.adminService.deleteChef(this.chefId).subscribe({
        next: () => {
          this.snackBar.open('Chef deleted successfully', 'Close', { duration: 3000 });
          this.chefId = '';
        },
        error: (err:ErrorEvent) => this.snackBar.open('Error deleting chef: ' + err.error.msg, 'Close', { duration: 3000 })
      });
    } else {
      this.snackBar.open('Please provide a chef ID', 'Close', { duration: 3000 });
    }
  }
}