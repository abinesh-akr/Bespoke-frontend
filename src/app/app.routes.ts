import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ServicesComponent } from './components/services/services.component';
import { HistoryComponent } from './components/history/history.component';
import { CartComponent } from './components/cart/cart.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ChefListComponent } from './components/chef-list/chef-list.component';
import { AdminAddFoodComponent } from './components/admin-add-food/admin-add-food.component';
import { AdminAddChefComponent } from './components/admin-add-chef/admin-add-chef.component';
import { AdminViewHistoryComponent } from './components/admin-view-history/admin-view-history.component';
import { AdminModifyFoodsComponent } from './components/admin-modify-foods/admin-modify-foods.component';
import { ChefLoginComponent } from './components/chef-login/chef-login.component';
import { ChefHomeComponent } from './components/chef-home/chef-home.component';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard';
import { ChefGuard } from './services/chef.guard';
import { loginGuard } from './services/login-guard.service';

export const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'chefs', component: ChefListComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', redirectTo: 'add-food', pathMatch: 'full' },
      { path: 'add-food', component: AdminAddFoodComponent },
      { path: 'add-chef', component: AdminAddChefComponent },
      { path: 'view-history', component: AdminViewHistoryComponent },
      { path: 'modify-foods', component: AdminModifyFoodsComponent }
    ]
  },
  {
    path: 'chef',
    children: [
      { path: 'login', component: ChefLoginComponent },
      { path: 'home', component: ChefHomeComponent, canActivate: [ChefGuard] }
    ]
  },
  { path: '**', redirectTo: '/signup' }
];