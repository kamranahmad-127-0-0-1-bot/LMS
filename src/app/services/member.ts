import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female';
  age: number;
  course: string;
  year: string;
  rollNumber: string;
  address: string;
  joinedDate: string;
  booksIssued: number;
}

@Injectable({ providedIn: 'root' })
export class MemberService {
  private subject = new BehaviorSubject<Member[]>([]);

  constructor() {
    const maleFirst = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Krishna', 'Ishaan', 'Rohan', 'Dev', 'Kabir', 'Aryan', 'Raj', 'Kunal', 'Amit', 'Rahul', 'Karan', 'Yash', 'Harsh', 'Dhruv'];
    const femaleFirst = ['Ananya', 'Diya', 'Ira', 'Myra', 'Kiara', 'Aadhya', 'Kavya', 'Riya', 'Saanvi', 'Aanya', 'Tara', 'Neha', 'Ritika', 'Pooja', 'Priya', 'Shreya', 'Isha', 'Divya', 'Anjali', 'Sakshi'];
    const last = ['Sharma', 'Patel', 'Singh', 'Iyer', 'Menon', 'Mehta', 'Gupta', 'Das', 'Bose', 'Kapoor', 'Nair', 'Pandey', 'Verma', 'Reddy', 'Chopra', 'Joshi', 'Rastogi', 'Banerjee', 'Mukherjee', 'Kulkarni'];
    
    const courses = ['B.Tech CSE', 'B.Tech ECE', 'B.Tech ME', 'BCA', 'MCA', 'B.Sc Physics', 'B.Sc Chemistry', 'B.Com', 'BBA', 'MBA'];
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

    const arr: Member[] = [];
    
    for (let i = 1; i <= 50; i++) {
      const isMale = i % 2 === 1;
      const firstName = isMale ? maleFirst[i % maleFirst.length] : femaleFirst[i % femaleFirst.length];
      const lastName = last[(i * 3) % last.length];
      const name = `${firstName} ${lastName}`;
      const emailName = name.toLowerCase().replace(/[^a-z]/g, '');
      
      // Generate phone number (Indian format)
      const phone = `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
      
      // Generate roll number
      const year = 2020 + (i % 4);
      const dept = ['CS', 'EC', 'ME', 'IT', 'EE'][i % 5];
      const rollNumber = `${year}${dept}${String(i).padStart(3, '0')}`;
      
      // Generate random joined date (within last 3 years)
      const joinedDate = new Date(2021 + Math.floor(i / 17), (i * 3) % 12, (i * 7) % 28 + 1).toISOString();
      
      arr.push({
        id: i,
        name,
        email: `${emailName}${i}@student.edu.in`,
        phone: phone,
        gender: isMale ? 'Male' : 'Female',
        age: 18 + (i % 8),
        course: courses[i % courses.length],
        year: years[i % years.length],
        rollNumber,
        address: `${i * 10} ${['Gandhi', 'Nehru', 'Patel', 'Bose'][i % 4]} Street, ${cities[i % cities.length]}`,
        joinedDate,
        booksIssued: Math.floor(Math.random() * 5)
      });
    }
    
    this.subject.next(arr);
  }

  getMembers$() {
    return this.subject.asObservable();
  }

  getMemberById(id: number) {
    return this.subject.value.find(m => m.id === id);
  }

  updateMember(id: number, updates: Partial<Member>) {
    const members = this.subject.value;
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...updates };
      this.subject.next([...members]);
    }
  }

  deleteMember(id: number) {
    const members = this.subject.value.filter(m => m.id !== id);
    this.subject.next(members);
  }
}