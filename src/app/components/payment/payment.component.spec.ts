import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentComponent } from './payment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderService } from '../../services/order.service';
import { of } from 'rxjs';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PaymentComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        MatAutocompleteModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: OrderService,
          useValue: {
            checkout: () => of({ deliveryFee: 50 })
          }
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize payment form', () => {
    expect(component.paymentForm).toBeDefined();
    expect(component.paymentForm.get('cardNumber')).toBeDefined();
    expect(component.paymentForm.get('expiry')).toBeDefined();
    expect(component.paymentForm.get('cvv')).toBeDefined();
    expect(component.paymentForm.get('location')).toBeDefined();
  });

  it('should load locations on init', () => {
    spyOn(component['http'], 'get').and.returnValue(of([{ name: 'Chennai', lat: 13.0827, lon: 80.2707, distance_km: 500 }]));
    component.ngAfterViewInit();
    expect(component['http'].get).toHaveBeenCalledWith('/assets/tamilnadu_locations.json');
    expect(component.locations.length).toBeGreaterThan(0);
  });
});