import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUserProfile().pipe(
      map((user: any) => {
        if (user.isAdmin) {
          return true;
        } else {
          console.log('AdminGuard: Redirecting to home');
          this.router.navigate(['/home']);
          return false;
        }
      })
    );
  }
}