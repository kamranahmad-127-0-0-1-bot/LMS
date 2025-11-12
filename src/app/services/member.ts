import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Member { id:number; name:string; email:string; }

@Injectable({ providedIn: 'root' })
export class MemberService {
  private subject = new BehaviorSubject<Member[]>([]);
  constructor() {
    const first = ['Aarav','Vivaan','Aditya','Vihaan','Arjun','Sai','Krishna','Ishaan','Rohan','Dev','Kabir','Ananya','Diya','Ira','Myra','Kiara','Aadhya','Kavya','Riya','Saanvi','Aanya','Tara','Neha','Ritika','Pooja'];
    const last  = ['Sharma','Patel','Singh','Iyer','Menon','Mehta','Gupta','Das','Bose','Kapoor','Nair','Pandey','Verma','Reddy','Chopra','Joshi','Rastogi','Banerjee','Mukherjee','Kulkarni'];
    const arr: Member[] = [];
    for (let i=1;i<=50;i++) {
      const name = `${first[i % first.length]} ${last[(i*3) % last.length]}`;
      arr.push({ id:i, name, email: name.toLowerCase().replace(/[^a-z]/g,'') + i + '@mail.in' });
    }
    this.subject.next(arr);
  }
  getMembers$() { return this.subject.asObservable(); }
}