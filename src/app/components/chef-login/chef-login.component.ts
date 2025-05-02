import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ChefService } from '../../services/chef.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-chef-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule,RouterLink],
  templateUrl: './chef-login.component.html',
  styleUrls: ['./chef-login.component.scss']
})
export class ChefLoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private chefService: ChefService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.chefService.login(this.loginForm.value).subscribe({
        next: () => {
          this.snackBar.open('Login successful', 'Close', { duration: 3000 });
          this.router.navigate(['/chef/home']);
        },
        error: (err:ErrorEvent) => this.snackBar.open('Error logging in: ' + err.error.msg, 'Close', { duration: 3000 })
      });
    }
  }
}