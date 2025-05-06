import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl + '/api/admin';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  addFood(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/food`, data, { headers: this.getHeaders() });
  }

  updateFood(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/food/${id}`, data, { headers: this.getHeaders() });
  }

  deleteFood(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/food/${id}`, { headers: this.getHeaders() });
  }

  addChef(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/chef`, data, { headers: this.getHeaders() });
  }

  deleteChef(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/chef/${id}`, { headers: this.getHeaders() });
  }

  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`, { headers: this.getHeaders() });
  }
  getChefs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chefs`,{ headers: this.getHeaders() });
  }
}