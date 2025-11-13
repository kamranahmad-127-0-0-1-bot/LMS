import { Component, AfterViewInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton, IonIcon, IonSearchbar,
  IonSegment, IonSegmentButton, IonModal, IonButton
} from '@ionic/angular/standalone';
import {
  CommonModule, NgFor, NgIf, NgClass, DatePipe
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { BookService } from '../../services/book.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    CommonModule, NgFor, NgIf, NgClass, DatePipe,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonMenuButton, IonIcon, IonModal,
    IonSearchbar, IonSegment, IonSegmentButton,
    IonButton, FormsModule
  ]
})
export class DashboardPage implements AfterViewInit {
  currentYear = new Date().getFullYear();
  searchQuery = '';
  filter = 'all';
  showNotifications = false;

  totalBooks$ = this.books.getBooks$().pipe(map(b => new Intl.NumberFormat().format(b.length)));

  stats = [
    { label: 'Total Books', value: '1,245', meta: 'Updated today', icon: 'library-outline' },
    { label: 'Active Members', value: '456', meta: '↑ 12% growth', icon: 'people-outline', trend: 'up' },
    { label: 'Books Borrowed', value: '89', meta: 'Currently issued', icon: 'receipt-outline' },
    { label: 'Overdue Books', value: '5', meta: '↓ 5 from last week', icon: 'time-outline', trend: 'down' },
    { label: 'New Additions', value: '32', meta: 'This month', icon: 'add-circle-outline' },
    { label: 'Pending Returns', value: '11', meta: 'Due in 3 days', icon: 'alert-outline' },
  ];

  topBooks = [
    { title: 'The Alchemist', author: 'Paulo Coelho', image: 'https://i.imgur.com/7NLCZkG.jpg', rating: 5 },
    { title: 'Atomic Habits', author: 'James Clear', image: 'https://i.imgur.com/aK5blIb.jpg', rating: 5 },
    { title: 'Sapiens', author: 'Yuval Noah Harari', image: 'https://i.imgur.com/sQ9ZkzY.jpg', rating: 4 },
    { title: '1984', author: 'George Orwell', image: 'https://i.imgur.com/zmzBSlq.jpg', rating: 5 }
  ];

  upcomingReturns = [
    { name: 'Ayesha Khan', book: 'Rich Dad Poor Dad', due: new Date(new Date().setDate(new Date().getDate() + 2)) },
    { name: 'Zain Ali', book: 'Deep Work', due: new Date(new Date().setDate(new Date().getDate() + 3)) },
    { name: 'Sara Iqbal', book: 'The Psychology of Money', due: new Date(new Date().setDate(new Date().getDate() + 4)) }
  ];

  notifications = [
    { icon: 'alert-circle-outline', message: '3 members have overdue books' },
    { icon: 'book-outline', message: 'New book "The Mountain Is You" added' },
    { icon: 'person-add-outline', message: 'New member joined: Hamza Tariq' },
    { icon: 'time-outline', message: '2 books are due for return tomorrow' },
    { icon: 'library-outline', message: 'System backup completed successfully' }
  ];

  recentActivity = [
    { user: 'Ayesha Khan', action: 'borrowed "Atomic Habits"', time: '2h ago' },
    { user: 'Zain Ali', action: 'returned "The Alchemist"', time: '5h ago' },
    { user: 'Sara Iqbal', action: 'added new book record', time: '1d ago' },
    { user: 'Hamza Tariq', action: 'joined as a new member', time: '2d ago' }
  ];

  constructor(private books: BookService) {}

  ngAfterViewInit() {
    this.renderCharts();
  }

  renderCharts() {
    const borrowCtx = document.getElementById('borrowChart') as HTMLCanvasElement;
    const categoryCtx = document.getElementById('categoryChart') as HTMLCanvasElement;

    if (borrowCtx) {
      new Chart(borrowCtx, {
        type: 'line',
        data: {
          labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
          datasets: [{
            label: 'Books Borrowed',
            data: [45, 60, 55, 70, 65, 80],
            borderColor: '#6f3bff',
            backgroundColor: 'rgba(111, 59, 255, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#6f3bff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animations: { tension: { duration: 1000, easing: 'easeInOutSine' } },
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
          }
        }
      });
    }

    if (categoryCtx) {
      new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
          labels: ['Fiction', 'Science', 'Technology', 'History', 'Arts'],
          datasets: [{
            data: [40, 25, 15, 10, 10],
            backgroundColor: ['#6f3bff', '#9b7dff', '#b89bff', '#d6baff', '#ede0ff']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { enabled: true }
          }
        }
      });
    }
  }

  open(path: string) {
    window.location.href = path;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  clearNotifications() {
    this.notifications = [];
  }
}
