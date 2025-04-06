import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Clarity VM environment
const mockClarity = {
  tx: {
    sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
  block: {
    height: 100,
  },
};

// Mock the contract functions
const bookRegistration = {
  books: new Map(),
  nextBookId: 1,
  
  registerBook(title, author, publicationYear, publisher, isbn) {
    const bookId = this.nextBookId;
    
    this.books.set(bookId, {
      title,
      author,
      publicationYear,
      publisher,
      isbn,
      registeredBy: mockClarity.tx.sender,
      registrationTime: mockClarity.block.height
    });
    
    this.nextBookId++;
    return { value: bookId };
  },
  
  getBook(bookId) {
    return this.books.get(bookId) || null;
  },
  
  bookExists(bookId) {
    return this.books.has(bookId);
  }
};

describe('Book Registration Contract', () => {
  beforeEach(() => {
    // Reset the contract state before each test
    bookRegistration.books = new Map();
    bookRegistration.nextBookId = 1;
    mockClarity.block.height = 100;
  });
  
  it('should register a new book', () => {
    const result = bookRegistration.registerBook(
        'Moby Dick',
        'Herman Melville',
        1851,
        'Harper & Brothers',
        '9780553213119'
    );
    
    expect(result.value).toBe(1);
    expect(bookRegistration.nextBookId).toBe(2);
  });
  
  it('should retrieve book details', () => {
    bookRegistration.registerBook(
        'Moby Dick',
        'Herman Melville',
        1851,
        'Harper & Brothers',
        '9780553213119'
    );
    
    const book = bookRegistration.getBook(1);
    
    expect(book).not.toBeNull();
    expect(book.title).toBe('Moby Dick');
    expect(book.author).toBe('Herman Melville');
    expect(book.publicationYear).toBe(1851);
    expect(book.registeredBy).toBe(mockClarity.tx.sender);
  });
  
  it('should check if a book exists', () => {
    bookRegistration.registerBook(
        'Moby Dick',
        'Herman Melville',
        1851,
        'Harper & Brothers',
        '9780553213119'
    );
    
    expect(bookRegistration.bookExists(1)).toBe(true);
    expect(bookRegistration.bookExists(2)).toBe(false);
  });
  
  it('should assign sequential IDs to books', () => {
    bookRegistration.registerBook(
        'Moby Dick',
        'Herman Melville',
        1851,
        'Harper & Brothers',
        '9780553213119'
    );
    
    bookRegistration.registerBook(
        'Pride and Prejudice',
        'Jane Austen',
        1813,
        'T. Egerton',
        '9780141439518'
    );
    
    expect(bookRegistration.getBook(1).title).toBe('Moby Dick');
    expect(bookRegistration.getBook(2).title).toBe('Pride and Prejudice');
  });
});
