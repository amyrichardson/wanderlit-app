myApp.controller('BookController', ['UserService', 'BookService', function(UserService, BookService) {
    console.log('BookController created');
    var self = this;
    self.userService = UserService;
    self.bookService = BookService;
    self.goodreadsBooks = BookService.goodreadsBooks; 
    self.continents = ['Africa', 'Asia', 'Australia', 'Europe', 'North America', 'South America'];

    //sends book search info to BookService
    self.findBooks = function(bookSearch) {
        BookService.findBooks(bookSearch);
    } //end findBooks

    self.addBook = function(book, continent) {
        let bookToAdd = {
            title: book.best_book.title._text,
            author: book.best_book.author.name._text,
            continent: continent,
            cover_url: book.best_book.image_url._text,
            average_rating: book.average_rating._text,
            year_published: book.original_publication_year._text
        }
        console.log('in add book', bookToAdd);
        
    }
  }]);
  