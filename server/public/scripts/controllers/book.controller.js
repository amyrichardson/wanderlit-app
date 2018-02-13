myApp.controller('BookController', ['UserService', 'BookService', function(UserService, BookService) {
    console.log('BookController created');
    var self = this;
    self.userService = UserService;
    
    
    //book lists
    self.bookService = BookService;
    self.goodreadsBooks = BookService.goodreadsBooks; 
    self.books = BookService.books;

    //continent list
    self.continents = BookService.continents;
    

    //sends book search info to BookService
    self.findBooks = function(bookSearch) {
        BookService.findBooks(bookSearch)
    } //end findBooks

    //creates new book object for book service to send to server
    self.addBook = function(book, continent) {
        console.log('continent in controller: ', continent);
        
        let bookToAdd = {
            title: book.best_book.title._text,
            author: book.best_book.author.name._text,
            cover_url: book.best_book.image_url._text,
            average_rating: book.average_rating._text,
            year_published: book.original_publication_year._text,
            continent: continent.name
        } //end bookToAdd object

        BookService.addBook(bookToAdd);
    } //end addBook


    //get books from db
    self.getBooks = function(continent) {
        console.log('getting books for: ', continent);
        BookService.getBooks(continent);
    } //end getBooks

    self.deleteBook = function(bookId) {
        console.log('deleting book', bookId);
        BookService.deleteBook(bookId);
    }

  }]);
  