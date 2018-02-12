myApp.controller('BookController', ['UserService', 'BookService', 'ContinentService', function(UserService, BookService, ContinentService) {
    console.log('BookController created');
    var self = this;
    self.userService = UserService;
    
    
    self.bookService = BookService;
    self.goodreadsBooks = BookService.goodreadsBooks; 
    self.books = BookService.books;


    self.continentService = ContinentService;
    self.continents = ContinentService.continents;
    

    //sends book search info to BookService
    self.findBooks = function(bookSearch) {
        BookService.findBooks(bookSearch);
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
            continent: continent.id
        } //end bookToAdd object

        BookService.addBook(bookToAdd);
    } //end addBook


    //get books by continent from db
    // self.getContinentBooks = function(continent) {
    //     console.log('getting books for: ', continent);
    //     BookService.getContinentBooks(continent);
    // } //end getContinentBooks


    
  }]);
  