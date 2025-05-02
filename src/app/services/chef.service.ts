import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChefService {
  private apiUrl = environment.apiUrl+'/api/chef';
  private chefSubject = new BehaviorSubject<any>(null);
  chef$ = this.chefSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token) {
      this.loadChefProfile();
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('chefToken', response.token);
        this.loadChefProfile();
      })
    );
  }

  loadChefProfile() {
    this.http.get(`${this.apiUrl}/profile`, { headers: this.getHeaders() }).subscribe({
      next: (chef) => this.chefSubject.next(chef),
      error: () => this.logout()
    });
  }

  getToken(): string | null {
    return localStorage.getItem('chefToken');
  }

  logout() {
    localStorage.removeItem('chefToken');
    this.chefSubject.next(null);
    this.router.navigate(['/chef/login']);
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`, { headers: this.getHeaders() });
  }

  completeOrder(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/complete`, {}, { headers: this.getHeaders() });
  }

  getChefs(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}