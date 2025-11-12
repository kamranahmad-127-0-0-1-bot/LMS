import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton
} from '@ionic/angular/standalone';
import { NgFor, AsyncPipe } from '@angular/common';
import { BorrowService } from '../services/borrow.service';
import { Storage } from '@ionic/storage-angular';
import { BookService } from '../services/book.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-borrowing',
  standalone: true,
  templateUrl: './borrowing.page.html',
  styleUrls: ['./borrowing.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, NgFor, AsyncPipe]
})
export class BorrowingPage {
  userEmail = '';
  records$ = this.borrowService.stream().pipe(
    map(recs => recs.filter(r => this.userEmail && r.userEmail === this.userEmail && !r.returnedAt))
  );

  constructor(private borrowService: BorrowService, private storage: Storage, public bookService: BookService) {
    this.storage.create().then(async () => {
      this.userEmail = (await this.storage.get('currentUser'))?.email || 'guest@mail.in';
    });
  }

  bookTitle(id: number) {
    const b = this.bookService['booksSubject'].value.find((x: any) => x.id === id);
    return b ? b.title : 'Book';
  }

  async return(recId: number) {
    await this.borrowService.return(recId);
    alert('Returned!');
  }
}