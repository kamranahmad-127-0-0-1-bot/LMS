import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton,
  IonCard, IonCardContent, IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonMenuButton,
    IonCard, IonCardContent, IonButton
  ]
})
export class SettingsPage implements OnInit {
  user: any;
  constructor(private storage: Storage, private router: Router) {}
  async ngOnInit() { await this.storage.create(); this.user = await this.storage.get('currentUser'); }
  async logout() { await this.storage.remove('currentUser'); this.router.navigateByUrl('/login', { replaceUrl: true }); }
}