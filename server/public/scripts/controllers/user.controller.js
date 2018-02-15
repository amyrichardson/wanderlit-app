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
  self.bookCount = UserService.bookCount;
  self.totalBooksRead = UserService.totalBooksRead;
  
  //labels and data for pie chart
  self.labels = ['Africa', 'Asia', 'Australia', 'Europe', 'North America', 'South America'];
  self.data = self.bookCount.count;

  //get books from database
  self.getBooks = function(continent) {
    BookService.getBooks(continent);
  } //end getBooks

  //check if book has already been added to users lists
  self.checkBookLists = function(book) {
    console.log('checking book: ', book);
    
    if(UserService.checkBookLists(book) === true) {
      self.addBookToList(book);
    }
  }

  //add book to user list
  self.addBookToList = function(book) {
    UserService.addBookToList(book, self.userObject.id);
    self.addBookSnackbar();
  } //end addBookToList

  self.addBookSnackbar = function() {
    var x = document.getElementById('snackbar');
    x.className = 'show';
    setTimeout(function(){ x.className = x.className.replace('show', '');}, 3000);
  }

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
    UserService.removeBookFromLists(bookId);
  }

}]);
