import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { BookService } from './book.service'; // Import the service, not the interface

// A simple mock for the Storage service
class StorageMock {
  private store: { [key: string]: any } = {};
  public create(): Promise<void> {
    return Promise.resolve();
  }
  public get(key: string): Promise<any> {
    return Promise.resolve(this.store[key]);
  }
  public set(key: string, value: any): Promise<any> {
    this.store[key] = value;
    return Promise.resolve(value);
  }
}

describe('BookService', () => { // 1. Describe the service, not the interface
  let service: BookService;     // 2. The variable should be of type BookService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookService,
        // Provide the mock Storage for the service to use
        { provide: Storage, useClass: StorageMock }
      ]
    });
    // 3. Inject the actual BookService
    service = TestBed.inject(BookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});