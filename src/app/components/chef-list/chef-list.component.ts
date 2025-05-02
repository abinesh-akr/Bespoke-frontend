import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ChefService } from '../../services/chef.service';
  import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
  import { MatCardModule } from '@angular/material/card';
  import { NavbarComponent } from '../navbar/navbar.component';
  @Component({
    selector: 'app-chef-list',
    standalone: true,
    imports: [
      CommonModule,
      MatCardModule,
      MatSnackBarModule,
      NavbarComponent
    ],
    templateUrl: './chef-list.component.html',
    styleUrls: ['./chef-list.component.scss']
  })
  export class ChefListComponent implements OnInit {
    chefs: any[] = [];

    constructor(
      private chefService: ChefService,
      private snackBar: MatSnackBar
    ) {}

    ngOnInit() {
      this.chefService.getChefs().subscribe({
        next: (data) => {
          this.chefs = data;
        },
        error: () => {
          this.snackBar.open('Failed to load chefs', 'Close', { duration: 3000 });
        }
      });
    }
  }