import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonItem, IonInput, IonButton, IonLabel
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonItem, IonInput, IonButton, IonLabel,
    FormsModule, CommonModule
  ]
})
export class SignupPage implements OnInit {
  name = '';
  email = '';
  password = '';
  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";

  constructor(private router: Router, private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();
  }

  async signup() {
    const users = (await this.storage.get('users')) || [];
    users.push({ name: this.name, email: this.email, password: this.password });
    await this.storage.set('users', users);
    alert('Account created successfully!');
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}