import { Component, signal } from '@angular/core';
import {
  IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonContent, IonHeader, IonToolbar,
  IonList, IonItem, IonIcon, IonLabel, IonButton, IonAvatar
} from '@ionic/angular/standalone';
import { Router, NavigationEnd } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { filter } from 'rxjs/operators';
import { NavController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonContent, IonHeader, IonToolbar,
    IonList, IonItem, IonIcon, IonLabel, IonButton, IonAvatar
  ]
})
export class AppComponent {
  isPublicRoute = signal(true);
  private publicPaths = ['/landing', '/login', '/signup'];

  constructor(
    private storage: Storage,
    private router: Router,
    private nav: NavController,
    private menu: MenuController
  ) {
    this.storage.create();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const url = e.urlAfterRedirects || e.url;
        this.isPublicRoute.set(this.publicPaths.some(p => url.startsWith(p)));
      });
  }

  // Instant navigation (same mechanism as LOGIN/SIGN UP)
  open(to: string, ev?: Event) {
    ev?.preventDefault();
    this.menu.close();                                      // close drawer
    this.nav.navigateRoot(to, { animated: false });         // instant nav
    requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: 'auto' })         // old‑school feel
    );
  }

  async logout() {
    await this.storage.remove('currentUser');
    this.open('/login');
  }
}