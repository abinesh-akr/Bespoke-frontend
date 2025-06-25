import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl+'/api/cart';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCart(): Observable<any> {
    const token = this.authService.getToken();
    console.log('Token for getCart:', token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrl, { headers }).pipe(
      tap(response => console.log('getCart response:', JSON.stringify(response, null, 2)))
    );
  }

  addToCart(item: any): Observable<any> {
    const token = this.authService.getToken();
    console.log('Token for addToCart:', token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/add`, item, { headers }).pipe(
      tap(response => console.log('addToCart response:', response))
    );
  }

  updateCartItem(item: any): Observable<any> {
    const token = this.authService.getToken();
    console.log('Token for updateCartItem:', token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/update`, item, { headers }).pipe(
      tap(response => console.log('updateCartItem response:', response))
    );
  }
}