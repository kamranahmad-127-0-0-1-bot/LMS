import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

export type BookStatus = 'available' | 'borrowed';
export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  cover: string;
  category: string;
  status: BookStatus;
  readerUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly storageKey = 'books';
  private readonly versionKey = 'books_version';
  private readonly SEED_VERSION = 2; // bump this when you change the seed

  private booksSubject = new BehaviorSubject<Book[]>([]);
  private categoriesSubject = new BehaviorSubject<string[]>([
    'Fiction','Non-Fiction','Technology','Science','History','Children',
    'Self-Help','Business','Biography','Fantasy','Mystery','Romance','Poetry','Comics'
  ]);
  private initialized = false;

  constructor(private storage: Storage) {}

  async init(): Promise<void> {
    if (this.initialized) return;
    await this.storage.create();

    // One-time reseed if you open /route?reseed=1
    const q = new URLSearchParams(window.location.search);
    if (q.has('reseed')) {
      await this.clearAndReseed();
      this.initialized = true;
      return;
    }

    const storedVersion = await this.storage.get(this.versionKey);
    const storedBooks: Book[] = (await this.storage.get(this.storageKey)) || [];

    // If version changed or there is no data, reseed
    if (storedVersion !== this.SEED_VERSION || storedBooks.length === 0) {
      const seed = await this.buildSeed();
      await this.storage.set(this.storageKey, seed);
      await this.storage.set(this.versionKey, this.SEED_VERSION);
      this.booksSubject.next(seed);
      this.initialized = true;
      this.exposeDebug();
      return;
    }

    // Use existing data
    this.booksSubject.next(storedBooks);
    this.initialized = true;
    this.exposeDebug();
  }

  // ========= PUBLIC =========
  getBooks$() { return this.booksSubject.asObservable(); }
  getCategories$() { return this.categoriesSubject.asObservable(); }
  selectBook$(id: number) { return this.getBooks$().pipe(map(bs => bs.find(b => b.id === id))); }

  private async persist(next: Book[]) {
    this.booksSubject.next([...next]);
    await this.storage.set(this.storageKey, next);
  }

  async addBook(partial: Omit<Book, 'id' | 'status'>) {
    const current = this.booksSubject.value;
    const id = current.length ? Math.max(...current.map(b => b.id)) + 1 : 1;
    const book: Book = { id, status: 'available', ...partial };
    await this.persist([...current, book]);
    return book;
  }
  async updateBook(updated: Book) {
    const current = this.booksSubject.value;
    const idx = current.findIndex(b => b.id === updated.id);
    if (idx > -1) { current[idx] = { ...updated }; await this.persist(current); }
  }
  async deleteBook(id: number) {
    const next = this.booksSubject.value.filter(b => b.id !== id);
    await this.persist(next);
  }
  async setStatus(id:number, status:BookStatus) {
    const current = this.booksSubject.value;
    const idx = current.findIndex(b => b.id===id);
    if (idx>-1) { current[idx] = { ...current[idx], status }; await this.persist(current); }
  }

  // ========= SEEDING =========
  private async buildSeed(): Promise<Book[]> {
    // Curated with Open Library covers (by ISBN)
    const curated: Array<{ t:string; a:string; c:string; i:string; d:string; r?:string }> = [
      { t:'1984', a:'George Orwell', c:'Fiction', i:'9780451524935', d:'Dystopian classic on surveillance.', r:'https://www.gutenberg.org/cache/epub/7370/pg7370-images.html' },
      { t:'To Kill a Mockingbird', a:'Harper Lee', c:'Fiction', i:'9780061120084', d:'A tale of justice and childhood.' },
      { t:'The Great Gatsby', a:'F. Scott Fitzgerald', c:'Fiction', i:'9780743273565', d:'The Jazz Age and the American dream.' },
      { t:'Pride and Prejudice', a:'Jane Austen', c:'Romance', i:'9780141439518', d:'Witty courtship & social commentary.', r:'https://www.gutenberg.org/cache/epub/1342/pg1342-images.html' },
      { t:'Moby-Dick', a:'Herman Melville', c:'Fiction', i:'9780142437247', d:'The epic pursuit of the white whale.', r:'https://www.gutenberg.org/cache/epub/2701/pg2701-images.html' },
      { t:'Brave New World', a:'Aldous Huxley', c:'Fiction', i:'9780060850524', d:'A chilling vision of a managed utopia.' },
      { t:'The Catcher in the Rye', a:'J.D. Salinger', c:'Fiction', i:'9780316769488', d:'Holden Caulfield’s iconic voice.' },
      { t:'Lord of the Flies', a:'William Golding', c:'Fiction', i:'9780399501487', d:'Civilization vs savagery on an island.' },
      { t:'The Hobbit', a:'J.R.R. Tolkien', c:'Fantasy', i:'9780007458424', d:'Bilbo’s unexpected journey.' },
      { t:'The Kite Runner', a:'Khaled Hosseini', c:'Fiction', i:'9781594631931', d:'Friendship and redemption.' },

      { t:'Clean Code', a:'Robert C. Martin', c:'Technology', i:'9780132350884', d:'Write clean, maintainable code.' },
      { t:'The Pragmatic Programmer', a:'Andrew Hunt, David Thomas', c:'Technology', i:'9780201616224', d:'Timeless tips for professionals.' },
      { t:'Introduction to Algorithms', a:'Cormen et al.', c:'Technology', i:'9780262033848', d:'The CLRS bible of algorithms.' },
      { t:'Design Patterns', a:'Gamma et al.', c:'Technology', i:'9780201633610', d:'Reusable OOP design principles.' },

      { t:'The Lean Startup', a:'Eric Ries', c:'Business', i:'9780307887894', d:'Build, measure, learn to PMF.' },
      { t:'Atomic Habits', a:'James Clear', c:'Self-Help', i:'9780735211292', d:'Tiny habits, massive results.' },
      { t:'Deep Work', a:'Cal Newport', c:'Self-Help', i:'9781455586691', d:'Focused success in a distracted world.' },
      { t:'Thinking, Fast and Slow', a:'Daniel Kahneman', c:'Non-Fiction', i:'9780374533557', d:'Two systems of thought and biases.' },
      { t:'Sapiens', a:'Yuval Noah Harari', c:'Non-Fiction', i:'9780062316097', d:'A brief history of humankind.' },
      { t:'Educated', a:'Tara Westover', c:'Biography', i:'9780399590504', d:'From survivalist to scholar.' },
      { t:'Becoming', a:'Michelle Obama', c:'Biography', i:'9781524763138', d:'Memoir of the former First Lady.' },

      { t:'A Brief History of Time', a:'Stephen Hawking', c:'Science', i:'9780553380163', d:'Cosmology made accessible.' },
      { t:'The Selfish Gene', a:'Richard Dawkins', c:'Science', i:'9780198788608', d:'Genes at the helm of evolution.' },
      { t:'Guns, Germs, and Steel', a:'Jared Diamond', c:'History', i:'9780393317558', d:'Geography’s role in societies.' },

      { t:'Harry Potter and the Sorcerer’s Stone', a:'J.K. Rowling', c:'Children', i:'9780590353427', d:'Where the magic begins.' },

      { t:'Crime and Punishment', a:'Fyodor Dostoevsky', c:'Mystery', i:'9780140449136', d:'Guilt & redemption.', r:'https://www.gutenberg.org/cache/epub/2554/pg2554-images.html' },
      { t:'War and Peace', a:'Leo Tolstoy', c:'History', i:'9780199232765', d:'Russia in the Napoleonic era.', r:'https://www.gutenberg.org/cache/epub/2600/pg2600-images.html' },
      { t:'The Alchemist', a:'Paulo Coelho', c:'Fiction', i:'9780061122415', d:'Following your personal legend.' },
      { t:'The Lord of the Rings', a:'J.R.R. Tolkien', c:'Fantasy', i:'9780261102385', d:'An epic quest through Middle‑earth.' }
    ];

    const books: Book[] = curated.map((b, idx) => ({
      id: idx + 1,
      title: b.t,
      author: b.a,
      description: b.d,
      category: b.c,
      status: 'available',
      readerUrl: b.r,
      cover: this.olCoverByIsbn(b.i)
    }));

    // Fill up to a bigger catalog with reliable picsum covers
    const targetTotal = 120;
    if (books.length < targetTotal) {
      books.push(...this.generateFiller(books.length + 1, targetTotal - books.length));
    }

    return books;
  }

  private olCoverByIsbn(isbn: string): string {
    // Open Library covers (usually work; if adblock blocks, picsum filler ensures enough covers)
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  }

  private generateFiller(startId: number, count: number): Book[] {
    const cats = this.categoriesSubject.value;
    const firstNames = ['Aarav','Vivaan','Aditya','Vihaan','Arjun','Sai','Krishna','Ishaan','Rohan','Dev','Kabir','Ananya','Diya','Ira','Myra','Kiara','Aadhya','Kavya','Riya','Saanvi'];
    const lastNames  = ['Sharma','Patel','Singh','Iyer','Menon','Mehta','Gupta','Das','Bose','Kapoor','Nair','Pandey','Verma','Reddy','Chopra','Joshi'];

    const out: Book[] = [];
    for (let k = 0; k < count; k++) {
      const id = startId + k;
      const cat = cats[id % cats.length];
      const author = `${firstNames[id % firstNames.length]} ${lastNames[(id*3) % lastNames.length]}`;
      const title = `${this.titleFor(cat)} #${id}`;
      // picsum gives a guaranteed image, so your list always has covers
      const cover = `https://picsum.photos/seed/libraryhub-${id}/300/420`;
      out.push({
        id, title, author,
        description: `A ${cat.toLowerCase()} title focused on ${title}.`,
        cover, category: cat, status: 'available'
      });
    }
    return out;
  }

  private titleFor(cat: string): string {
    switch (cat) {
      case 'Technology': return 'Modern Web Patterns';
      case 'Science':    return 'Exploring the Cosmos';
      case 'History':    return 'Echoes of the Past';
      case 'Business':   return 'Strategy & Growth';
      case 'Biography':  return 'Life & Legacy';
      case 'Fantasy':    return 'Realm of Secrets';
      case 'Mystery':    return 'Shadows and Clues';
      case 'Romance':    return 'Hearts in Harmony';
      case 'Poetry':     return 'Verses of Time';
      case 'Comics':     return 'Panels of Adventure';
      case 'Children':   return 'Little Explorers';
      case 'Self-Help':  return 'Habits to Thrive';
      case 'Non-Fiction':return 'True Tales & Insights';
      default:           return 'Storyline';
    }
  }

  // ======== UTILITIES ========
  async clearAndReseed() {
    const seed = await this.buildSeed();
    await this.storage.set(this.storageKey, seed);
    await this.storage.set(this.versionKey, this.SEED_VERSION);
    this.booksSubject.next(seed);
    console.info('[LibraryHub] Books reseeded:', seed.length);
  }

  // Expose a console helper for quick reseed during dev
  private exposeDebug() {
    (window as any).reseedBooks = async () => {
      await this.clearAndReseed();
      return 'Reseed complete';
    };
  }
}