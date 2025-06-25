import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AudioService } from './audio.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl+'/api/auth';
  private token: string | null = null;

  constructor(private http: HttpClient,private audioService:AudioService) {
    this.token = localStorage.getItem('token');
    console.log('AuthService initialized, token:', this.token); // Debugging
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.token = response.token;
          localStorage.setItem('token', response.token);
         // this.audioService.playAudio('assets/welcome.mp3', 5000);
        console.log('Login successful, audio played');
          console.log('Login: Token stored:', this.token);
        } else {
          console.error('Login: No token in response:', response);
        }
      })
    );
  }

  signup(email: string, password: string, extraData: { name?: string; preferences?: string } = {}): Observable<any> {
    const body = { email, password, ...extraData };
    console.log('Signup request body:', body);
    return this.http.post(`${this.apiUrl}/signup`, body).pipe(
      tap((response: any) => {
        if (response.token) {
          this.token = response.token;
          localStorage.setItem('token', response.token);
          console.log('Signup token stored:', this.token);
        }
      })
    );
  }

  getToken(): string | null {
    return this.token;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    console.log('Logged out, token cleared');
  }

  isLoggedIn(): boolean {
    const loggedIn = !!this.token;
    console.log('isLoggedIn check:', loggedIn, 'Token:', this.token);
    return loggedIn;
  }

  getUserProfile(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }
}