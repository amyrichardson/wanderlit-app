myApp.controller('BookController', ['UserService', 'BookService', function(UserService, BookService) {
    console.log('BookController created');
    var self = this;
    self.userService = UserService;
    self.bookService = BookService;
    self.goodreadsBooks = BookService.goodreadsBooks; 


    //sends book search info to BookService
    self.findBooks = function(bookSearch) {
        BookService.findBooks(bookSearch);
    } //end findBooks

  }]);
  