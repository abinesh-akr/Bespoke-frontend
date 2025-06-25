import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // Add RouterLink
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CanActivate } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, RouterLink], // Add RouterLink
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private isAdmin=true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Attempting login with:', { email, password });
      //this.audioService.playAudio('assets/welcome.mp3', 2000); 
      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          console.log('Login response:', response);
          if (response.token) {
            console.log('Token received, user logged in:', this.authService.isLoggedIn());
            this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
            console.log("hohoho");
            
         
            if(this.isAdmin)
            {
              this.router.navigate(['/admin']).then(success => {
                console.log('Navigation to admin page successful:', success);
                if (!success) {
                  console.log('Forcing redirect to home');
                  window.location.href = '/admin'; // Fallback if router fails
                }
              }).catch(err => {
                console.error('Navigation error:', err);
              });
            }
            else{
            this.router.navigate(['/home']).then(success => {
              console.log('Navigation to home successful:', success);
              if (!success) {
                console.log('Forcing redirect to home');
                window.location.href = '/home'; // Fallback if router fails
              }
            }).catch(err => {
              console.error('Navigation error:', err);
            });
          }
          //this.audioService.playAudio('assets/welcome.mp3', 5000); 
        }
        else {
            console.error('No token in response:', response);
            this.snackBar.open('Login failed: No token received', 'Close', { duration: 3000 });
          }
         // this.audioService.playAudio('assets/welcome.mp3', 5000);
        console.log('Login successful, audio played');
        },
        error: (err: any) => {
          console.error('Login error:', err);
          this.snackBar.open('Login failed: ' + (err.error?.msg || 'Unknown error'), 'Close', { duration: 3000 });
        }
      });
    } else {
      console.log('Form invalid:', this.loginForm.errors);
      this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 3000 });
    }
    

  }
  
}