myApp.controller('UserController', ['UserService', 'BookService', function(UserService, BookService) {
  console.log('UserController created');
  var self = this;

  // * Book Service *
  self.bookService = BookService;
  self.books = BookService.books; //list of books from database
  self.continents = BookService.continents; //list of continents
  self.singleBook = BookService.singleBook; //one book from database
  self.getBooks = BookService.getBooks; //get books from database
  self.getSingleBook = BookService.getSingleBook;   //get single book w/ router params
  self.renderHtml = BookService.renderHtml;   //render html to plain text for book description

  // * User Service * 
  self.userService = UserService; 
  self.userObject = UserService.userObject; //contains username, user id
  self.toRead = UserService.toRead; //books in user's to read list
  self.currentlyReading = UserService.currentlyReading; //books in user's currently reading list
  self.previouslyRead = UserService.previouslyRead; //books in user's previously read list
  self.bookCount = UserService.bookCount; //number of books read by continent
  self.totalBooksRead = UserService.totalBooksRead; //total number of books read
  self.addBookToList = UserService.addBookToList;     //add book to user list
  self.removeBookFromLists = UserService.removeBookFromLists;   //remove book from users lists
  self.changeBookStatus = UserService.changeBookStatus;   //change books status given id and new status


  //labels and data for overview chart
  self.labels = ['Africa', 'Asia', 'Australia', 'Europe', 'North America', 'South America'];
  self.data = self.bookCount.count;
 

  //check if book has already been added to users lists before adding
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

}]);
