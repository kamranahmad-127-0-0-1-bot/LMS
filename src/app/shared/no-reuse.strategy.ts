import { Injectable } from '@angular/core';
import { IonicRouteStrategy } from '@ionic/angular';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

@Injectable()
export class NoReuseRouteStrategy extends IonicRouteStrategy {
  constructor() { super(); }

  override shouldDetach(_route: ActivatedRouteSnapshot): boolean { return false; }
  override store(_route: ActivatedRouteSnapshot, _handle: DetachedRouteHandle | null): void {}
  override shouldAttach(_route: ActivatedRouteSnapshot): boolean { return false; }
  override retrieve(_route: ActivatedRouteSnapshot): DetachedRouteHandle | null { return null; }
  override shouldReuseRoute(_future: ActivatedRouteSnapshot, _curr: ActivatedRouteSnapshot): boolean { return false; }
}