// list.page.ts
import { Component } from '@angular/core';
import { BookService } from '../../services/book.service';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton,
  IonList, IonItem, IonThumbnail, IonLabel,
  IonSearchbar, IonSelect, IonSelectOption, IonBadge
} from '@ionic/angular/standalone';
import { NgFor, AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { TriggerNavDirective } from '../../shared/trigger-nav.directive';

@Component({
  selector: 'app-list',
  standalone: true,
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonMenuButton,
    IonList, IonItem, IonThumbnail, IonLabel,
    IonSearchbar, IonSelect, IonSelectOption, IonBadge,
    NgFor, AsyncPipe,
    TriggerNavDirective
  ]
})
export class ListPage {
  search$ = new BehaviorSubject<string>(''); 
  category$ = new BehaviorSubject<string>('All');

  categories$ = this.bookService.getCategories$().pipe(
    map(cats => ['All', ...cats])
  );

  books$ = combineLatest([
    this.bookService.getBooks$(),
    this.search$,
    this.category$
  ]).pipe(
    map(([books, q, cat]) => {
      const s = (q || '').toLowerCase().trim();
      return books.filter(b =>
        (cat === 'All' || b.category === cat) &&
        (!s || b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s))
      );
    })
  );

  constructor(private bookService: BookService) {}

  onSearch(ev: any) { this.search$.next(ev.detail?.value ?? ''); }
  onCat(ev: any)   { this.category$.next(ev.detail?.value ?? 'All'); }
}