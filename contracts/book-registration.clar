;; Book Registration Contract
;; Records details of rare or valuable volumes

;; Define data structures
(define-map books
  { book-id: uint }
  {
    title: (string-utf8 100),
    author: (string-utf8 100),
    publication-year: uint,
    publisher: (string-utf8 100),
    isbn: (string-utf8 20),
    registered-by: principal,
    registration-time: uint
  }
)

(define-data-var next-book-id uint u1)

;; Register a new book
(define-public (register-book
    (title (string-utf8 100))
    (author (string-utf8 100))
    (publication-year uint)
    (publisher (string-utf8 100))
    (isbn (string-utf8 20)))
  (let ((book-id (var-get next-book-id)))
    (map-insert books
      { book-id: book-id }
      {
        title: title,
        author: author,
        publication-year: publication-year,
        publisher: publisher,
        isbn: isbn,
        registered-by: tx-sender,
        registration-time: block-height
      }
    )
    (var-set next-book-id (+ book-id u1))
    (ok book-id)
  )
)

;; Get book details
(define-read-only (get-book (book-id uint))
  (map-get? books { book-id: book-id })
)

;; Check if a book exists
(define-read-only (book-exists (book-id uint))
  (is-some (map-get? books { book-id: book-id }))
)
