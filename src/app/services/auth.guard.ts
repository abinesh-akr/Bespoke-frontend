import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('AuthGuard: isLoggedIn=', isLoggedIn, 'Token=', this.authService.getToken());
    if (isLoggedIn) {
      return true;
    } else {
      console.log('AuthGuard: Redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}