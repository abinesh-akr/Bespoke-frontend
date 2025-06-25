import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      preferences: ['']
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password, preferences } = this.signupForm.value;
      console.log('Signup form data:', { name, email, password, preferences });
      this.authService.signup(email, password, { name, preferences }).subscribe({
        next: (response: any) => {
          console.log('Signup response:', response);
          if (response.token) {
            this.snackBar.open('Signup successful! Redirecting to login...', 'Close', { duration: 3000 });
            this.router.navigate(['/login']).then(success => {
              console.log('Navigation to login successful:', success);
            }).catch(err => {
              console.error('Navigation error:', err);
            });
          } else {
            this.snackBar.open('Signup failed: No token received', 'Close', { duration: 3000 });
          }
        },
        error: (err: any) => {
          console.error('Signup error:', err);
          this.snackBar.open('Signup failed: ' + (err.error?.msg || 'Unknown error'), 'Close', { duration: 3000 });
        }
      });
    } else {
      console.log('Form invalid:', this.signupForm?.errors);
      this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 3000 });
    }
  }
}