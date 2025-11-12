import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { BookService } from './app/services/book.service';
import { NoReuseRouteStrategy } from './app/shared/no-reuse.strategy';

// Ionicons base path + icons registration
import { addIcons, setAssetPath } from 'ionicons';
import {
  gridOutline, bookOutline, peopleOutline, swapHorizontalOutline, settingsOutline,
  libraryOutline, timeOutline, receiptOutline, analyticsOutline, searchOutline,
  addOutline, createOutline, trashOutline, menuOutline, moonOutline
} from 'ionicons/icons';

// Important: point Ionicons at the app base
setAssetPath(document.baseURI || '/');
addIcons({
  gridOutline, bookOutline, peopleOutline, swapHorizontalOutline, settingsOutline,
  libraryOutline, timeOutline, receiptOutline, analyticsOutline, searchOutline,
  addOutline, createOutline, trashOutline, menuOutline, moonOutline
});

function initBooksFactory(bookService: BookService) {
  return () => bookService.init();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: NoReuseRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    importProvidersFrom(IonicStorageModule.forRoot()),
    { provide: APP_INITIALIZER, useFactory: initBooksFactory, deps: [BookService], multi: true }
  ],
}).catch(console.error);