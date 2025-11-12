import { Directive, HostListener, Input, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Directive({
  selector: '[triggerNav]',
  standalone: true,
})
export class TriggerNavDirective {
  // Accept a string or an array of string|number
  @Input('triggerNav') to!: string | Array<string | number>;

  private router = inject(Router);
  private zone = inject(NgZone);
  private menu = inject(MenuController);

  @HostListener('click')
  async onClick() {
    let url: string;

    if (Array.isArray(this.to)) {
      // Safely convert all parts to strings
      url = this.to.map(part => String(part)).join('/');
    } else {
      url = this.to;
    }

    this.zone.run(() => this.router.navigateByUrl(url, { replaceUrl: false }));
    try { await this.menu.close(); } catch {}
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  }
}