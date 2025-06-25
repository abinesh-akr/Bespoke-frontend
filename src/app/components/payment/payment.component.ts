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
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

interface Location {
  distance?: number; // Kept optional to match existing data structure
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
  map!: Map;
  deliveryFee: number | null = null;
  restaurantLocation: [number, number] = [77.7978, 9.4650]; // Sivakasi (lon, lat)
  userMarker: Feature | null = null;
  vectorLayer!: VectorLayer<VectorSource>;
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
    const restaurantFeature = new Feature({
      geometry: new Point(fromLonLat(this.restaurantLocation)),
      name: 'Spoke Restaurant'
    });
    restaurantFeature.setStyle(
      new Style({
        image: new Icon({
          src: '/assets/marker-icon.png', // Ensure this asset exists in src/assets
          scale: 0.1
        })
      })
    );

    const vectorSource = new VectorSource({
      features: [restaurantFeature]
    });

    this.vectorLayer = new VectorLayer({
      source: vectorSource
    });

    this.map = new Map({
      target: this.mapElement.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.vectorLayer
      ],
      view: new View({
        center: fromLonLat(this.restaurantLocation),
        zoom: 10
      })
    });
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
    if (!this.locations.length) return null;
    const location = control.value;
    return this.locations.some(loc => loc.name.toLowerCase() === location?.toLowerCase())
      ? null
      : { invalidLocation: true };
  }

  onLocationSelected(event: MatAutocompleteSelectedEvent) {
    const selectedLocation = this.locations.find(loc => loc.name === event.option.value);
    if (selectedLocation) {
      this.updateMap([selectedLocation.lon, selectedLocation.lat], selectedLocation.name);
    }
  }

  updateMap(coords: [number, number], location: string) {
    this.map.getView().setCenter(fromLonLat(coords));
    if (this.userMarker) {
      this.vectorLayer.getSource()?.removeFeature(this.userMarker);
    }
    this.userMarker = new Feature({
      geometry: new Point(fromLonLat(coords)),
      name: `Delivery: ${location}`
    });
    this.userMarker.setStyle(
      new Style({
        image: new Icon({
          src: '/assets/marker-icon.png', // Ensure this asset exists
          scale: 0.1
        })
      })
    );
    this.vectorLayer.getSource()?.addFeature(this.userMarker);
    this.calculateDeliveryFee(coords);
  }

  calculateDeliveryFee(coords: [number, number]) {
    const distance = this.haversineDistance(
      this.restaurantLocation[1],
      this.restaurantLocation[0],
      coords[1],
      coords[0]
    );
    this.deliveryFee = distance * 10; // ₹10 per km
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestLocation = this.findNearestLocation(latitude, longitude);
          if (nearestLocation) {
            this.paymentForm.patchValue({ location: nearestLocation.name });
            this.updateMap([nearestLocation.lon, nearestLocation.lat], nearestLocation.name);
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
    if (this.locations.length === 1) {
      const distance = this.haversineDistance(lat, lon, this.locations[0].lat, this.locations[0].lon);
      return { ...this.locations[0], distance };
    }
    return this.locations.reduce((nearest, loc) => {
      const distance = this.haversineDistance(lat, lon, loc.lat, loc.lon);
      if (distance < nearest.distance!) {
        return { ...loc, distance };
      }
      return nearest;
    }, { ...this.locations[0], distance: this.haversineDistance(lat, lon, this.locations[0].lat, this.locations[0].lon) });
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
          this.deliveryFee = response.deliveryFee || this.deliveryFee;
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