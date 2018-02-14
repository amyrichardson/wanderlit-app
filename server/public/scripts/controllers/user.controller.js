myApp.controller('UserController', ['UserService', 'BookService', function(UserService, BookService) {
  console.log('UserController created');
  var self = this;
  //connect to services
  self.userService = UserService; 
  self.bookService = BookService;

  self.userObject = UserService.userObject;

  //lists from book service
  self.books = BookService.books;
  self.continents = BookService.continents;

  //lists from list service
  self.toRead = UserService.toRead;
  self.currentlyReading = UserService.currentlyReading;
  self.previouslyRead = UserService.previouslyRead;
  

  //get books from database
  self.getBooks = function(continent) {
    BookService.getBooks(continent);
  } //end getBooks

  //add book to user list
  self.addBookToList = function(book) {
    UserService.addBookToList(book, self.userObject.id);
  } //end addBookToList

  //change books status given id and new status
  self.changeBookStatus = function(bookId, newStatus) {
    let bookInfo = {
      bookId: bookId,
      newStatus: newStatus
    }
    UserService.changeBookStatus(bookInfo);
  } //end changeBookStatus

  //remove book from users lists
  self.removeBookFromLists = function(bookId) {
    console.log('removing book from user list: ', bookId);
    UserService.removeBookFromLists(bookId);
  }

}]);
