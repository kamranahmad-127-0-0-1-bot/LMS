import { Component, HostListener } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon
} from '@ionic/angular/standalone';
import Swal from 'sweetalert2';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon
  ]
})
export class LandingPage {
  location: { lat: number; lng: number } | null = null;

  constructor(
    private nav: NavController,
    private menu: MenuController,
    private locationService: LocationService
  ) {}

  open(to: string, ev?: Event) {
    ev?.preventDefault();
    this.menu.close();
    this.nav.navigateRoot(to, { animated: false });
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  }

  featureComingSoon(ev?: Event) {
    ev?.preventDefault();
    Swal.fire({
      icon: 'info',
      title: 'Coming Soon!',
      text: 'This feature is under development. Stay tuned!',
      confirmButtonColor: '#6f3bff'
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    const y = Math.min(window.scrollY, 600);
    document.documentElement.style.setProperty('--landing-parallax', `${y * 0.35}px`);
  }

  async getLocation() {
    this.location = await this.locationService.getCurrentPosition();
    if (!this.location) {
      Swal.fire({
        icon: 'error',
        title: 'Location Error',
        text: 'Could not retrieve your location. Make sure location is enabled.',
        confirmButtonColor: '#6f3bff'
      });
    }
  }
}
