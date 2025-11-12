import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // Import RouterLink
import {
  IonContent, IonItem, IonLabel, IonInput, IonButton,
  IonCheckbox, IonGrid, IonRow, IonCol, IonIcon,
  IonHeader, IonToolbar // Added IonHeader and IonToolbar
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { addIcons } from 'ionicons';
import { logoGoogle, logoGithub } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, // Added these imports
    IonContent, IonItem, IonLabel, IonInput, IonButton, IonCheckbox,
    IonGrid, IonRow, IonCol, IonIcon,
    FormsModule, CommonModule, RouterLink // Added RouterLink
  ]
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";

  constructor(private router: Router, private storage: Storage) {
    addIcons({ logoGoogle, logoGithub });
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async login() {
    const email = this.email.trim();
    const pwd = this.password.trim();

    // Basic validation (can be replaced with actual user authentication)
    if (email === 'admin@library.com' && pwd === 'password') {
      await this.storage.set('currentUser', { name: 'Admin', email, role: 'admin' });
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      return;
    }

    // Example for a general user login
    const name = email.includes('@') ? email.split('@')[0] : (email || 'Guest');
    await this.storage.set('currentUser', { name, email, role: 'guest' });
    this.router.navigateByUrl('/dashboard', { replaceUrl: true });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  forgotPassword() {
    alert('Forgot Password functionality can be added here.');
  }

  loginWithGoogle() {
    alert('Login with Google functionality can be added here.');
  }

  loginWithGitHub() {
    alert('Login with GitHub functionality can be added here.');
  }
}