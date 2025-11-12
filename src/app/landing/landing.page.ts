import { Component, HostListener } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import {
  IonHeader, IonToolbar, IonButtons, IonButton,
  IonContent, IonCard, IonCardContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  imports: [
    // Re-adding IonHeader and IonToolbar to fix the error
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonCard,
    IonCardContent
  ]
})
export class LandingPage {
  constructor(private nav: NavController, private menu: MenuController) {}

  // Instant navigation for the buttons on the landing page
  open(to: string, ev?: Event) {
    ev?.preventDefault();
    this.menu.close();
    this.nav.navigateRoot(to, { animated: false });
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  }
  
  // Parallax effect for the background image on scroll
  @HostListener('window:scroll')
  onScroll() {
    const y = Math.min(window.scrollY, 600);
    document.documentElement.style.setProperty('--landing-parallax', `${y * 0.35}px`);
  }
}