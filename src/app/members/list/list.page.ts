import { Component } from '@angular/core';
import { MemberService } from '../../services/member';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonSearchbar, IonIcon, IonBadge, IonButton, IonRow, IonCol
} from '@ionic/angular/standalone';
import { NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { addIcons } from 'ionicons';
import { 
  mailOutline, callOutline, schoolOutline, locationOutline, 
  calendarOutline, bookOutline, timeOutline, eyeOutline, 
  createOutline, peopleOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-members-list',
  standalone: true,
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonMenuButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonSearchbar, IonIcon, IonBadge, IonButton, IonRow, IonCol,
    NgFor, AsyncPipe, DatePipe
  ]
})
export class ListPage {
  q$ = new BehaviorSubject<string>('');
  
  members$ = combineLatest([this.svc.getMembers$(), this.q$]).pipe(
    map(([ms, q]) => {
      const s = (q || '').toLowerCase().trim();
      return ms.filter(m => 
        !s || 
        m.name.toLowerCase().includes(s) || 
        m.email.toLowerCase().includes(s) ||
        m.rollNumber.toLowerCase().includes(s) ||
        m.phone.includes(s) ||
        m.course.toLowerCase().includes(s)
      );
    })
  );

  constructor(private svc: MemberService) {
    addIcons({ 
      mailOutline, callOutline, schoolOutline, locationOutline, 
      calendarOutline, bookOutline, timeOutline, eyeOutline, 
      createOutline, peopleOutline 
    });
  }

  search(e: any) {
    this.q$.next(e.detail?.value || '');
  }
}