import { Component } from '@angular/core';
import { MemberService } from '../../services/member';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton,
  IonList, IonItem, IonLabel, IonSearchbar
} from '@ionic/angular/standalone';
import { NgFor, AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-members-list',
  standalone: true,
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonMenuButton,
    IonList, IonItem, IonLabel, IonSearchbar,
    NgFor, AsyncPipe
  ]
})
export class ListPage {
  q$ = new BehaviorSubject<string>('');
  members$ = combineLatest([this.svc.getMembers$(), this.q$]).pipe(
    map(([ms,q]) => {
      const s=(q||'').toLowerCase().trim();
      return ms.filter(m => !s || m.name.toLowerCase().includes(s) || m.email.toLowerCase().includes(s));
    })
  );
  constructor(private svc: MemberService) {}
  search(e:any){ this.q$.next(e.detail?.value||''); }
}