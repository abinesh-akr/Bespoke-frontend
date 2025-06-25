import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ChefService } from './chef.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChefGuard implements CanActivate {
  constructor(private chefService: ChefService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.chefService.chef$.pipe(
      take(1),
      map(chef => {
        if (chef) {
          return true;
        } else {
          this.router.navigate(['/chef/login']);
          return false;
        }
      })
    );
  }
}