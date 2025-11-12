import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing',  loadComponent: () => import('./landing/landing.page').then(m => m.LandingPage) },
  { path: 'login',    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage) },
  { path: 'signup',   loadComponent: () => import('./auth/signup/signup.page').then(m => m.SignupPage) },
  { path: 'dashboard',loadComponent: () => import('./home/dashboard/dashboard.page').then(m => m.DashboardPage) },
  { path: 'books',    loadComponent: () => import('./books/list/list.page').then(m => m.ListPage) },
  { path: 'books/:id',loadComponent: () => import('./books/details/details.page').then(m => m.DetailsPage) },
  { path: 'members',  loadComponent: () => import('./members/list/list.page').then(m => m.ListPage) },
  { path: 'borrowing',loadComponent: () => import('./borrowing/list/list.page').then(m => m.ListPage) },
  { path: 'profile',  loadComponent: () => import('./profile/settings/settings.page').then(m => m.SettingsPage) },
  { path: '**', redirectTo: 'landing' }
];