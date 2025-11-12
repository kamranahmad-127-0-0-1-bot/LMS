import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton, IonIcon
} from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { map, of } from 'rxjs';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonMenuButton, IonIcon,  // <-- add IonIcon here
    AsyncPipe
  ]
})
export class DashboardPage {
  totalBooks$ = this.books.getBooks$().pipe(map(b => new Intl.NumberFormat().format(b.length)));
  activeMembers$ = of('456');
  borrowed$ = of('89');
  overdue$ = of('5');

  constructor(private books: BookService) {}
}