import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton,
  IonCard, IonIcon, IonToggle
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  personCircle, camera, star, book, time, checkmarkCircle,
  create, settings, notifications, mail, bookmark, eye,
  phonePortrait, moon, language, text, shieldCheckmark,
  lockClosed, fingerPrint, download, informationCircle,
  chatbubbles, documentText, newspaper, warning, trash,
  logOut, closeCircle, chevronForward
} from 'ionicons/icons';
import Swal from 'sweetalert2';

interface UserSettings {
  dueDateReminders: boolean;
  emailNotifications: boolean;
  autoRenew: boolean;
  showHistory: boolean;
  darkMode: boolean;
  language: string;
  fontSize: string;
  biometric: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonMenuButton,
    IonCard, IonIcon, IonToggle,
    FormsModule
  ]
})
export class SettingsPage implements OnInit {
  user: any;
  borrowedCount = 0;
  activeLoans = 0;
  returnedCount = 0;

  settings: UserSettings = {
    dueDateReminders: true,
    emailNotifications: true,
    autoRenew: false,
    showHistory: true,
    darkMode: false,
    language: 'English',
    fontSize: 'Medium',
    biometric: false
  };

  constructor(private storage: Storage, private router: Router) {
    addIcons({
      personCircle, camera, star, book, time, checkmarkCircle,
      create, settings, notifications, mail, bookmark, eye,
      phonePortrait, moon, language, text, shieldCheckmark,
      lockClosed, fingerPrint, download, informationCircle,
      chatbubbles, documentText, newspaper, warning, trash,
      logOut, closeCircle, chevronForward
    });
  }

  async ngOnInit() {
    await this.storage.create();
    this.user = await this.storage.get('currentUser');
    await this.loadSettings();
    await this.loadStats();
  }

  getUserInitials(): string {
    if (!this.user?.name) return 'GU';
    const names = this.user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return this.user.name.substring(0, 2).toUpperCase();
  }

  async loadSettings() {
    const savedSettings = await this.storage.get('userSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...savedSettings };
    }
  }

  async saveSettings() {
    await this.storage.set('userSettings', this.settings);
    await Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Your preferences have been updated.',
      timer: 1500,
      showConfirmButton: false
    });
  }

  async loadStats() {
    // Simulate loading borrowing stats
    // In a real app, you'd fetch this from your BorrowService
    this.borrowedCount = 24;
    this.activeLoans = 3;
    this.returnedCount = 21;
  }

  async changeAvatar() {
    await Swal.fire({
      title: 'Change Avatar',
      text: 'Avatar upload feature coming soon!',
      icon: 'info',
      confirmButtonColor: '#6f3bff'
    });
  }

  async editProfile() {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Profile',
      html: `
        <input id="name" class="swal2-input" placeholder="Name" value="${this.user?.name || ''}">
        <input id="email" class="swal2-input" placeholder="Email" value="${this.user?.email || ''}">
        <input id="phone" class="swal2-input" placeholder="Phone" value="${this.user?.phone || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#6f3bff',
      confirmButtonText: 'Save Changes',
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const phone = (document.getElementById('phone') as HTMLInputElement).value;
        
        if (!name || !email) {
          Swal.showValidationMessage('Name and email are required');
          return null;
        }
        
        return { name, email, phone };
      }
    });

    if (formValues) {
      this.user = { ...this.user, ...formValues };
      await this.storage.set('currentUser', this.user);
      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  async viewHistory() {
    this.router.navigateByUrl('/borrowing');
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark', this.settings.darkMode);
    this.saveSettings();
  }

  async changeLanguage() {
    const { value: language } = await Swal.fire({
      title: 'Select Language',
      input: 'select',
      inputOptions: {
        'English': 'English',
        'Hindi': 'हिन्दी',
        'Spanish': 'Español',
        'French': 'Français',
        'German': 'Deutsch'
      },
      inputValue: this.settings.language,
      showCancelButton: true,
      confirmButtonColor: '#6f3bff'
    });

    if (language) {
      this.settings.language = language;
      await this.saveSettings();
    }
  }

  async changeFontSize() {
    const { value: fontSize } = await Swal.fire({
      title: 'Select Font Size',
      input: 'select',
      inputOptions: {
        'Small': 'Small',
        'Medium': 'Medium',
        'Large': 'Large',
        'Extra Large': 'Extra Large'
      },
      inputValue: this.settings.fontSize,
      showCancelButton: true,
      confirmButtonColor: '#6f3bff'
    });

    if (fontSize) {
      this.settings.fontSize = fontSize;
      await this.saveSettings();
    }
  }

  async changePassword() {
    const { value: formValues } = await Swal.fire({
      title: 'Change Password',
      html: `
        <input id="current-password" type="password" class="swal2-input" placeholder="Current Password">
        <input id="new-password" type="password" class="swal2-input" placeholder="New Password">
        <input id="confirm-password" type="password" class="swal2-input" placeholder="Confirm Password">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#6f3bff',
      confirmButtonText: 'Change Password',
      preConfirm: () => {
        const current = (document.getElementById('current-password') as HTMLInputElement).value;
        const newPass = (document.getElementById('new-password') as HTMLInputElement).value;
        const confirm = (document.getElementById('confirm-password') as HTMLInputElement).value;
        
        if (!current || !newPass || !confirm) {
          Swal.showValidationMessage('All fields are required');
          return null;
        }
        
        if (newPass !== confirm) {
          Swal.showValidationMessage('Passwords do not match');
          return null;
        }
        
        if (newPass.length < 6) {
          Swal.showValidationMessage('Password must be at least 6 characters');
          return null;
        }
        
        return { current, newPass };
      }
    });

    if (formValues) {
      await Swal.fire({
        icon: 'success',
        title: 'Password Changed',
        text: 'Your password has been updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  async manageData() {
    const result = await Swal.fire({
      title: 'Download Your Data',
      text: 'Download a copy of your library data including borrowing history, preferences, and more.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#6f3bff',
      confirmButtonText: 'Download',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      // Simulate data download
      const userData = {
        profile: this.user,
        settings: this.settings,
        stats: {
          borrowed: this.borrowedCount,
          active: this.activeLoans,
          returned: this.returnedCount
        }
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'library-data.json';
      link.click();

      await Swal.fire({
        icon: 'success',
        title: 'Download Started',
        text: 'Your data is being downloaded.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  }

  async viewAbout() {
    await Swal.fire({
      title: 'About LibraryHub',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Build:</strong> 2025.01.13</p>
          <p style="margin-top: 16px;">LibraryHub is your complete library management solution, making it easy to discover, borrow, and manage books.</p>
          <p style="margin-top: 12px;"><strong>Features:</strong></p>
          <ul style="text-align: left; padding-left: 20px;">
            <li>Browse extensive book catalog</li>
            <li>Borrow and return books digitally</li>
            <li>Track borrowing history</li>
            <li>Get due date reminders</li>
            <li>Manage your reading preferences</li>
          </ul>
        </div>
      `,
      confirmButtonColor: '#6f3bff',
      confirmButtonText: 'Close'
    });
  }

  async contactSupport() {
    const { value: message } = await Swal.fire({
      title: 'Contact Support',
      html: `
        <input id="subject" class="swal2-input" placeholder="Subject">
        <textarea id="message" class="swal2-textarea" placeholder="Describe your issue..." rows="4"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#6f3bff',
      confirmButtonText: 'Send Message',
      preConfirm: () => {
        const subject = (document.getElementById('subject') as HTMLInputElement).value;
        const msg = (document.getElementById('message') as HTMLTextAreaElement).value;
        
        if (!subject || !msg) {
          Swal.showValidationMessage('Both fields are required');
          return null;
        }
        
        return { subject, msg };
      }
    });

    if (message) {
      await Swal.fire({
        icon: 'success',
        title: 'Message Sent',
        text: 'Our support team will contact you soon.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  async viewPrivacyPolicy() {
    await Swal.fire({
      title: 'Privacy Policy',
      html: `
        <div style="text-align: left; padding: 10px; max-height: 400px; overflow-y: auto;">
          <h4>Data Collection</h4>
          <p>We collect information necessary to provide library services, including your name, email, and borrowing history.</p>
          
          <h4>Data Usage</h4>
          <p>Your data is used solely for library management and improving our services. We never sell your information to third parties.</p>
          
          <h4>Data Security</h4>
          <p>We implement industry-standard security measures to protect your personal information.</p>
          
          <h4>Your Rights</h4>
          <p>You have the right to access, modify, or delete your data at any time.</p>
        </div>
      `,
      confirmButtonColor: '#6f3bff',
      confirmButtonText: 'I Understand',
      width: '600px'
    });
  }

  async viewTerms() {
    await Swal.fire({
      title: 'Terms of Service',
      html: `
        <div style="text-align: left; padding: 10px; max-height: 400px; overflow-y: auto;">
          <h4>Borrowing Terms</h4>
          <p>Books must be returned by the due date. Late returns may result in fines or suspension of borrowing privileges.</p>
          
          <h4>Acceptable Use</h4>
          <p>Library materials must be used responsibly and returned in good condition.</p>
          
          <h4>Account Responsibility</h4>
          <p>You are responsible for all activity under your account. Keep your credentials secure.</p>
          
          <h4>Modifications</h4>
          <p>We reserve the right to modify these terms. Continued use implies acceptance of changes.</p>
        </div>
      `,
      confirmButtonColor: '#6f3bff',
      confirmButtonText: 'Accept',
      width: '600px'
    });
  }

  async clearCache() {
    const result = await Swal.fire({
      title: 'Clear Cache?',
      text: 'This will free up storage space but may slow down the app temporarily.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'Clear Cache',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      // Simulate cache clearing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await Swal.fire({
        icon: 'success',
        title: 'Cache Cleared',
        text: 'Storage space has been freed up.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  }

  async logout() {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6f3bff',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      await this.storage.remove('currentUser');
      await this.storage.remove('isLoggedIn');
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  async deleteAccount() {
    const result = await Swal.fire({
      title: 'Delete Account?',
      html: `
        <p style="color: #ef4444; font-weight: 600;">⚠️ This action cannot be undone!</p>
        <p>All your data including borrowing history will be permanently deleted.</p>
        <p style="margin-top: 16px;">Type <strong>DELETE</strong> to confirm:</p>
      `,
      input: 'text',
      inputPlaceholder: 'Type DELETE',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete Forever',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (value !== 'DELETE') {
          return 'You must type DELETE to confirm';
        }
        return null;
      }
    });

    if (result.isConfirmed) {
      await this.storage.clear();
      await Swal.fire({
        icon: 'success',
        title: 'Account Deleted',
        text: 'Your account has been permanently deleted.',
        timer: 2000,
        showConfirmButton: false
      });
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }
}