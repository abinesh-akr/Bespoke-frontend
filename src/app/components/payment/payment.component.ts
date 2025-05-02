import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OrderService } from '../../services/order.service';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  paymentForm: FormGroup;

  constructor(
    private orderService: OrderService,

    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiry: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
    });
  }
  back(){
    this.router.navigate(['/cart']);

  }
   
  onSubmit() {
    if (this.paymentForm.valid) {
      this.orderService.checkout().subscribe({
        next: () => {
          this.snackBar.open('Payment successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          this.snackBar.open('Failed to place order', 'Close', { duration: 3000 });
        }
      });
      this.snackBar.open('Payment successful!', 'Close', { duration: 3000 });
      this.router.navigate(['/home']);
    }
  }
}