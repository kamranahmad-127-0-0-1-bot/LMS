import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { NgIf, AsyncPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { map, switchMap } from 'rxjs';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-reader',
  standalone: true,
  templateUrl: './reader.page.html',
  styleUrls: ['./reader.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, NgIf, AsyncPipe]
})
export class ReaderPage {
  safeUrl$ = this.route.queryParamMap.pipe(
    map(q => Number(q.get('id'))),
    switchMap(id => this.books.selectBook$(id)),
    map(b => b?.readerUrl || 'https://www.gutenberg.org/cache/epub/11/pg11-images.html'),
    map(url => this.sanitizer.bypassSecurityTrustResourceUrl(url) as SafeResourceUrl)
  );
  constructor(private route: ActivatedRoute, private books: BookService, private sanitizer: DomSanitizer) {}
}