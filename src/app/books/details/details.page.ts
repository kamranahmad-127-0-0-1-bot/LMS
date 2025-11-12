// G:\project v3\project 2\library-hub\src\app\books\details\details.page.ts
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { BookService, Book } from '../../services/book.service';
import { BorrowService } from '../../services/borrow';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton
} from '@ionic/angular/standalone';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, RouterModule, NgIf, AsyncPipe]
})
export class DetailsPage{
  book$ = this.route.paramMap.pipe(
    map(pm => Number(pm.get('id'))),
    switchMap(id => this.books.selectBook$(id))
  );
  constructor(private route: ActivatedRoute, private books: BookService, private borrow: BorrowService) {}

  async onBorrow(b: Book) { if (b.status==='available') await this.borrow.borrow(b.id, 'Guest'); }
  async onReturn(b: Book) { if (b.status==='borrowed') await this.borrow.return(b.id); }
  onRead(b: Book) { const url = b.readerUrl || 'https://www.gutenberg.org/cache/epub/11/pg11-images.html'; window.open(url,'_blank'); }
  onBuy(b: Book) { const q = encodeURIComponent(`${b.title} ${b.author}`); window.open(`https://www.amazon.in/s?k=${q}`,'_blank'); }
}