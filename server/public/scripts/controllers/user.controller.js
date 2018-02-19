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
  self.singleBook = BookService.singleBook;

  //lists from list service
  self.toRead = UserService.toRead;
  self.currentlyReading = UserService.currentlyReading;
  self.previouslyRead = UserService.previouslyRead;
  self.bookCount = UserService.bookCount;
  self.totalBooksRead = UserService.totalBooksRead;
  

  self.renderHtml = BookService.renderHtml;

  //labels and data for pie chart
  self.labels = ['Africa', 'Asia', 'Australia', 'Europe', 'North America', 'South America'];
  self.data = self.bookCount.count;

  //Book Functions

  //get books from database
  self.getBooks = function(continent) {
    BookService.getBooks(continent);
  } //end getBooks

  //get single book w/ router params
  self.getSingleBook = BookService.getSingleBook;

  //change books status given id and new status
  self.changeBookStatus = UserService.changeBookStatus;

  //remove book from users lists
  self.removeBookFromLists = UserService.removeBookFromLists;

  //check if book has already been added to users lists
  self.checkBookLists = function(book) {
      console.log('checking book: ', book);
      if(UserService.checkBookLists(book) === true) {
        console.log('book:', book);
        if(!book.status) {
          swal({
            title: 'Oops!',
            text: `Please select which list you'd like to add this book to.`,
            icon: 'error',
            button: 'OK'
          })        
        } else {
          self.addBookToList(book);
        }
      }
    } //end checkBookLists

  //add book to user list
  self.addBookToList = UserService.addBookToList;
  // self.addBookToList = function(book) {
  //   if(UserService.addBookToList(book, self.userObject.id) === true) {
  //     self.addBookSnackbar();
  //   }
  // } //end addBookToList

  //show snackbar when book is added
  self.addBookSnackbar = function() {
    var x = document.getElementById('snackbar');
    x.className = 'show';
    setTimeout(function(){ x.className = x.className.replace('show', '');}, 3000);
  }


}]);
