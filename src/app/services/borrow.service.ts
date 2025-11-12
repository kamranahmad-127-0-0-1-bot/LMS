// src/app/services/borrow.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

export interface BorrowRecord {
  id: number;
  bookId: number;
  userEmail: string;
  borrowedAt: string;  // ISO
  dueAt: string;       // ISO
  returnedAt?: string; // ISO
}

@Injectable({ providedIn: 'root' })
export class BorrowService {
  private key = 'borrows';
  private borrows$ = new BehaviorSubject<BorrowRecord[]>([]);
  private inited = false;

  constructor(private storage: Storage) { this.init(); }

  private async init() {
    if (this.inited) return;
    await this.storage.create();
    const existing = (await this.storage.get(this.key)) || [];
    this.borrows$.next(existing);
    this.inited = true;
  }

  stream() { return this.borrows$.asObservable(); }
  records() { return this.borrows$.value; }

  activeCount(bookId: number) {
    return this.records().filter(r => r.bookId === bookId && !r.returnedAt).length;
  }

  userActive(userEmail: string) {
    return this.records().filter(r => r.userEmail === userEmail && !r.returnedAt);
  }

  async borrow(bookId: number, userEmail: string, days = 14) {
    const now = new Date();
    const due = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const nextId = this.records().length ? Math.max(...this.records().map(r => r.id)) + 1 : 1;
    const rec: BorrowRecord = { id: nextId, bookId, userEmail, borrowedAt: now.toISOString(), dueAt: due.toISOString() };
    const next = [...this.records(), rec];
    await this.storage.set(this.key, next);
    this.borrows$.next(next);
    return rec;
  }

  async return(recordId: number) {
    const next = this.records().map(r => r.id === recordId ? { ...r, returnedAt: new Date().toISOString() } : r);
    await this.storage.set(this.key, next);
    this.borrows$.next(next);
  }
  
}