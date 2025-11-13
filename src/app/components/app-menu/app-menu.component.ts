// src/app/components/app-menu/app-menu.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';
import {
  IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonIcon, IonLabel, IonBadge, IonButton
} from '@ionic/angular/standalone';
import { AsyncPipe, NgIf } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  home, book, people, bookmarks, settings, logIn, personAdd,
  library, analytics, shield, newspaper, informationCircle
} from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
  imports: [
    IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonIcon, IonLabel, IonBadge, IonButton,
    AsyncPipe, NgIf
  ]
})
export class AppMenuComponent implements OnInit {
  authState$ = this.authService.authState$;
  currentRole: UserRole = 'guest';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      home, book, people, bookmarks, settings, logIn, personAdd,
      library, analytics, shield, newspaper, informationCircle
    });
  }

  ngOnInit() {
    this.authService.authState$.subscribe(state => {
      this.currentRole = state.role;
    });
  }

  isGuest(): boolean {
    return this.currentRole === 'guest';
  }

  isMember(): boolean {
    return this.currentRole === 'member';
  }

  isAdmin(): boolean {
    return this.currentRole === 'admin';
  }

  navigate(path: string) {
    this.router.navigateByUrl(path);
  }

  async logout() {
    await this.authService.logout();
  }
}

// app-menu.component.html
/*
<ion-menu contentId="main-content">
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>LibraryHub</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <!-- User Info Section -->
    <div class="user-info" *ngIf="authState$ | async as auth">
      <div class="avatar" [class.guest]="auth.role === 'guest'" [class.member]="auth.role === 'member'" [class.admin]="auth.role === 'admin'">
        <ion-icon [name]="auth.role === 'admin' ? 'shield' : (auth.role === 'member' ? 'person' : 'happy')"></ion-icon>
      </div>
      <div class="user-details">
        <h3>{{ auth.user?.name || 'Guest User' }}</h3>
        <ion-badge [color]="auth.role === 'admin' ? 'danger' : (auth.role === 'member' ? 'success' : 'medium')">
          {{ auth.role === 'admin' ? 'Administrator' : (auth.role === 'member' ? 'Member' : 'Guest') }}
        </ion-badge>
      </div>
    </div>

    <ion-list>
      <!-- Common Navigation -->
      <ion-item button (click)="navigate('/tabs/home')">
        <ion-icon name="home" slot="start"></ion-icon>
        <ion-label>Home</ion-label>
      </ion-item>

      <ion-item button (click)="navigate('/tabs/books')">
        <ion-icon name="book" slot="start"></ion-icon>
        <ion-label>Books</ion-label>
      </ion-item>

      <!-- Guest Only -->
      <ng-container *ngIf="isGuest()">
        <ion-item button (click)="navigate('/login')">
          <ion-icon name="log-in" slot="start" color="primary"></ion-icon>
          <ion-label color="primary">Login</ion-label>
        </ion-item>

        <ion-item button (click)="navigate('/signup')">
          <ion-icon name="person-add" slot="start" color="success"></ion-icon>
          <ion-label color="success">Sign Up</ion-label>
        </ion-item>
      </ng-container>

      <!-- Member & Admin -->
      <ng-container *ngIf="!isGuest()">
        <ion-item button (click)="navigate('/tabs/borrowing')">
          <ion-icon name="bookmarks" slot="start"></ion-icon>
          <ion-label>
            {{ isAdmin() ? 'Borrowing Records' : 'My Borrows' }}
          </ion-label>
        </ion-item>
      </ng-container>

      <!-- Admin Only -->
      <ng-container *ngIf="isAdmin()">
        <ion-item button (click)="navigate('/tabs/members')">
          <ion-icon name="people" slot="start" color="primary"></ion-icon>
          <ion-label>Manage Members</ion-label>
        </ion-item>

        <ion-item button (click)="navigate('/admin/analytics')">
          <ion-icon name="analytics" slot="start" color="tertiary"></ion-icon>
          <ion-label>Analytics</ion-label>
        </ion-item>
      </ng-container>

      <!-- Settings (All) -->
      <ion-item button (click)="navigate('/tabs/settings')">
        <ion-icon name="settings" slot="start"></ion-icon>
        <ion-label>
          {{ isAdmin() ? 'Admin Settings' : (isMember() ? 'Settings' : 'App Settings') }}
        </ion-label>
      </ion-item>

      <!-- Logout (Member & Admin) -->
      <ion-item button (click)="logout()" *ngIf="!isGuest()">
        <ion-icon name="log-out" slot="start" color="danger"></ion-icon>
        <ion-label color="danger">Logout</ion-label>
      </ion-item>
    </ion-list>

    <!-- App Info -->
    <div class="app-info">
      <p>LibraryHub v1.0.0</p>
      <p class="role-info">
        <ion-icon [name]="isAdmin() ? 'shield' : (isMember() ? 'person' : 'information-circle')"></ion-icon>
        {{ isAdmin() ? 'Admin Panel' : (isMember() ? 'Member Access' : 'Guest Mode') }}
      </p>
    </div>
  </ion-content>
</ion-menu>
*/