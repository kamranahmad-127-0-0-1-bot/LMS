import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, combineLatest, map } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { BookService } from './book.service';
import { MemberService } from './member';

export interface BorrowRecord {
  id: number;
  bookId: number;
  borrower: string;
  borrowedAt: string; // ISO
  dueAt: string;      // ISO
}

@Injectable({ providedIn: 'root' })
export class BorrowService {
  private key = 'borrows';
  private subject = new BehaviorSubject<BorrowRecord[]>([]);
  private inited = false;

  constructor(private storage: Storage, private books: BookService, private members: MemberService) { this.init(); }

  async init() {
    if (this.inited) return;
    await this.storage.create();
    const data = (await this.storage.get(this.key)) || [];
    if (!data.length) {
      const members = await firstValueFrom(this.members.getMembers$());
      const bookList = await firstValueFrom(this.books.getBooks$());
      const count = Math.min(50, bookList.length);
      const picks = [...bookList].sort(() => Math.random() - 0.5).slice(0, count);
      const seeded: BorrowRecord[] = [];
      let id = 1;
      for (const b of picks) {
        const m = members[Math.floor(Math.random() * members.length)];
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 40) + 1;
        const borrow = new Date(now.getTime() - daysAgo * 24 * 3600 * 1000);
        const due = new Date(borrow.getTime() + (7 + Math.floor(Math.random() * 21)) * 24 * 3600 * 1000);
        seeded.push({ id: id++, bookId: b.id, borrower: m.name, borrowedAt: borrow.toISOString(), dueAt: due.toISOString() });
        await this.books.setStatus(b.id, 'borrowed');
      }
      await this.storage.set(this.key, seeded);
      this.subject.next(seeded);
    } else {
      this.subject.next(data);
    }
    this.inited = true;
  }

  getBorrows$() { return this.subject.asObservable(); }

  getBorrowView$() {
    return combineLatest([this.getBorrows$(), this.books.getBooks$()]).pipe(
      map(([recs, books]) => recs.map(r => ({ ...r, book: books.find(b => b.id === r.bookId) })))
    );
  }

  private async persist(next: BorrowRecord[]) {
    this.subject.next([...next]);
    await this.storage.set(this.key, next);
  }

  async borrow(bookId: number, borrower = 'Guest') {
    const now = new Date();
    const due = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const list = this.subject.value;
    const id = list.length ? Math.max(...list.map(x => x.id)) + 1 : 1;
    await this.persist([...list, { id, bookId, borrower, borrowedAt: now.toISOString(), dueAt: due.toISOString() }]);
    await this.books.setStatus(bookId, 'borrowed');
  }

  async return(bookId: number) {
    const next = this.subject.value.filter(r => r.bookId !== bookId);
    await this.persist(next);
    await this.books.setStatus(bookId, 'available');
  }

  async update(recordId: number, changes: Partial<BorrowRecord>) {
    const list = this.subject.value;
    const idx = list.findIndex(r => r.id === recordId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...changes };
      await this.persist(list);
    }
  }

  async delete(recordId: number) {
    const updated = this.subject.value.filter(r => r.id !== recordId);
    await this.persist(updated);
  }
}
