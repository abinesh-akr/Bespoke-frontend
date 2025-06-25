import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { OrderService } from '../../services/order.service';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

interface Location {
  distance: number;
  name: string;
  lat: number;
  lon: number;
  distance_km: number;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef;
  paymentForm: FormGroup;
  map!: L.Map;
  deliveryFee: number | null = null;
  restaurantLocation: [number, number] = [9.4650, 77.7978]; // Sivakasi, Tamil Nadu
  userMarker: L.Marker | null = null;
  locations: Location[] = [];
  filteredLocations!: Observable<Location[]>;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiry: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      location: ['', [Validators.required, this.locationValidator.bind(this)]]
    });
  }

  ngAfterViewInit() {
    this.initMap();
    this.loadLocations();
  }

  initMap() {
    this.map = L.map(this.mapElement.nativeElement).setView(this.restaurantLocation, 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    L.marker(this.restaurantLocation)
      .addTo(this.map)
      .bindPopup('Spoke Restaurant')
      .openPopup();
  }

  loadLocations() {
    this.http.get<Location[]>('/assets/tamilnadu_locations.json').subscribe({
      next: (data) => {
        this.locations = data;
        this.setupLocationFilter();
      },
      error: (err) => {
        console.error('Error loading locations:', err);
        this.snackBar.open('Failed to load locations', 'Close', { duration: 3000 });
      }
    });
  }

  setupLocationFilter() {
    this.filteredLocations = this.paymentForm.get('location')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterLocations(value || ''))
    );
  }

  private filterLocations(value: string): Location[] {
    const filterValue = value.toLowerCase();
    return this.locations.filter(location => location.name.toLowerCase().includes(filterValue));
  }

  locationValidator(control: any): { [key: string]: boolean } | null {
    if (!this.locations.length) return null; // Skip validation until locations are loaded
    const location = control.value;
    return this.locations.some(loc => loc.name.toLowerCase() === location?.toLowerCase())
      ? null
      : { invalidLocation: true };
  }

  onLocationSelected(event: MatAutocompleteSelectedEvent) {
    const selectedLocation = this.locations.find(loc => loc.name === event.option.value);
    if (selectedLocation) {
      this.updateMap([selectedLocation.lat, selectedLocation.lon], selectedLocation.name);
    }
  }

  updateMap(coords: [number, number], location: string) {
    this.map.setView(coords, 10);
    if (this.userMarker) {
      this.map.removeLayer(this.userMarker);
    }
    this.userMarker = L.marker(coords)
      .addTo(this.map)
      .bindPopup(`Delivery: ${location}`)
      .openPopup();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestLocation = this.findNearestLocation(latitude, longitude);
          if (nearestLocation) {
            this.paymentForm.patchValue({ location: nearestLocation.name });
            this.updateMap([nearestLocation.lat, nearestLocation.lon], nearestLocation.name);
            this.snackBar.open(`Location set to ${nearestLocation.name}`, 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('No nearby locations found', 'Close', { duration: 3000 });
          }
        },
        (error) => {
          this.snackBar.open('Unable to get location: ' + error.message, 'Close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Geolocation not supported', 'Close', { duration: 3000 });
    }
  }

  private findNearestLocation(lat: number, lon: number): Location | null {
    if (!this.locations.length) return null;
    return this.locations.reduce((nearest, loc) => {
      const distance = this.haversineDistance(lat, lon, loc.lat, loc.lon);
      if (!nearest || distance < nearest.distance) {
        return { ...loc, distance };
      }
      return nearest;
    }, null as Location | null);
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  back() {
    this.router.navigate(['/cart']);
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const userLocation = this.paymentForm.get('location')?.value;
      this.orderService.checkout(userLocation).subscribe({
        next: (response) => {
          this.deliveryFee = response.deliveryFee;
          this.snackBar.open('Payment successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.snackBar.open('Payment failed: ' + (err.error?.msg || 'Unknown error'), 'Close', { duration: 3000 });
        }
      });
    }
  }
}