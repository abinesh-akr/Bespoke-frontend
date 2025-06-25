import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface Food {
  quantityAvailable: number;
  _id: string;
  name: string;
  price: number;
  image: string; // Base64 string (e.g., data:image/jpeg;base64,...)
  rating: number;
  chef: { _id: string; name: string };
  bespokeOption?: string;
  tags: string[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = environment.apiUrl+'/api/food';

  constructor(private http: HttpClient) {}

  getFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(this.apiUrl);
  }
}