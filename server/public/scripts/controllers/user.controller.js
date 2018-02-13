myApp.controller('UserController', ['UserService', 'BookService', 'ListService', function(UserService, BookService, ListService) {
  console.log('UserController created');
  var self = this;
  //connect to services
  self.userService = UserService; 
  self.bookService = BookService;
  self.listService = ListService;

  self.userObject = UserService.userObject;

  //lists from book service
  self.books = BookService.books;
  self.continents = BookService.continents;

  //lists from list service
  self.toRead = ListService.toRead;
  self.currentlyReading = ListService.currentlyReading;
  self.previouslyRead = ListService.previouslyRead;
  

  //get books from database
  self.getBooks = function(continent) {
    BookService.getBooks(continent);
  } //end getBooks

  //add book to user list
  self.addBookToList = function(book) {
    console.log('adding book to list', book);
    ListService.addBookToList(book, self.userObject.id);
  } //end addBookToList

  //on load
  ListService.getUserLists(self.userObject.id);
}]);
