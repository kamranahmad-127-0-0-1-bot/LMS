import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonTextarea,
  IonButton, IonList, IonThumbnail, IonIcon, IonSelect, IonSelectOption, IonBadge
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { Book, BookService } from '../../services/book.service';

@Component({
  selector: 'app-manage',
  standalone: true,
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonTextarea,
    IonButton, IonList, IonThumbnail, IonIcon, IonSelect, IonSelectOption, IonBadge,
    FormsModule, NgFor, NgIf, AsyncPipe
  ]
})
export class ManagePage {
  books$ = this.bookService.getBooks$();
  categories$ = this.bookService.getCategories$();

  showForm = false;
  form: Partial<Book> = { title: '', author: '', description: '', cover: '', category: 'Fiction' };
  editId: number | null = null;

  constructor(private bookService: BookService) {}

  toggleForm(addMode = true) {
    this.showForm = true;
    this.editId = addMode ? null : this.editId;
  }

  startEdit(book: Book) {
    this.form = { ...book };
    this.editId = book.id;
    this.showForm = true;
  }

  resetForm() {
    this.form = { title: '', author: '', description: '', cover: '', category: 'Fiction' };
    this.editId = null;
    this.showForm = false;
  }

  async save() {
    if (!this.form.title || !this.form.author || !this.form.description || !this.form.category) {
      alert('Fill all fields'); return;
    }
    if (this.editId == null) {
      await this.bookService.addBook({
        title: this.form.title!, author: this.form.author!,
        description: this.form.description!, cover: this.form.cover || 'https://picsum.photos/seed/custom/300/420',
        category: this.form.category!
      });
      alert('Book added');
    } else {
      await this.bookService.updateBook({
        id: this.editId, status: 'available',
        title: this.form.title!, author: this.form.author!,
        description: this.form.description!, cover: this.form.cover || 'https://picsum.photos/seed/custom/300/420',
        category: this.form.category!
      });
      alert('Book updated');
    }
    this.resetForm();
  }

  async delete(book: Book) {
    if (confirm(`Delete "${book.title}"?`)) {
      await this.bookService.deleteBook(book.id);
      alert('Book deleted');
    }
  }
}